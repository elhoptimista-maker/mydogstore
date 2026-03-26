"use client";

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/actions/checkout';
import { fetchCommunes } from '@/actions/communes';
import { useShippingRates } from '@/hooks/use-shipping-rates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ShieldCheck, Mail, User, Phone, MapPin, Truck, ChevronRight, Loader2, Search, Check, X, MapPinIcon, Map, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { auth } from '@/lib/firebase/client';
import { getUserData } from '@/lib/services/user.service';
import { User as FirebaseUser } from 'firebase/auth';

export default function CheckoutPage() {
  const { cart, cartTotal, cartType, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  const [communes, setCommunes] = useState<string[]>([]);
  const [communeSearch, setCommuneSearch] = useState("");
  const [showCommuneResults, setShowCommuneResults] = useState(false);
  const communeSearchRef = useRef<HTMLDivElement>(null);

  // Consumimos las tarifas reales del ERP para evitar discrepancias con el carrito
  const { getRateForComuna } = useShippingRates();

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [shipping, setShipping] = useState({ streetAndNumber: '', apartmentOrLocal: '', commune: '', region: 'Metropolitana', method: 'despacho' });
  const [billing, setBilling] = useState<{type: 'boleta' | 'factura', rut: string, companyName: string, businessLine: string, address: string}>({ 
    type: 'boleta', rut: '', companyName: '', businessLine: '', address: '' 
  });
  
  const [sameAddress, setSameAddress] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const [newAddressName, setNewAddressName] = useState('Casa');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('khipu');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: FirebaseUser | null) => {
      if (currentUser) {
        setUser(currentUser);
        setCustomer(prev => ({ ...prev, email: currentUser.email || '', name: currentUser.displayName || prev.name }));
        const dbData = await getUserData(currentUser.uid);
        if (dbData) {
          setCustomer(prev => ({ ...prev, phone: dbData.phone || prev.phone }));
          if (dbData.addresses && dbData.addresses.length > 0) {
             setSavedAddresses(dbData.addresses);
             const defaultAddress = dbData.addresses.find((a:any) => a.isDefault) || dbData.addresses[0];
             applySavedAddress(defaultAddress);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const applySavedAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setShipping(prev => ({
      ...prev,
      streetAndNumber: addr.streetAndNumber || addr.address || '',
      apartmentOrLocal: addr.apartmentOrLocal || '',
      commune: addr.commune || '',
      region: addr.region || 'Metropolitana'
    }));
    setCommuneSearch(addr.commune || '');
    setSaveNewAddress(false);
  };

  const handleManualAddressChange = () => {
    setSelectedAddressId('manual');
  };

  useEffect(() => {
    const loadCommunes = async () => {
      const list = await fetchCommunes();
      if (list.length > 0) setCommunes(list);
    };
    loadCommunes();
  }, []);

  const normalizeText = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredCommunes = communes.filter(c => normalizeText(c).includes(normalizeText(communeSearch)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (communeSearchRef.current && !communeSearchRef.current.contains(event.target as Node)) {
        setShowCommuneResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (cart.length === 0 && !loading) {
    return null; 
  }

  // Lógica de costo de envío 100% dinámica basada en el ERP
  const isFreeShipping = cartType === 'retail' && cartTotal >= 50000;
  const baseShippingCost = getRateForComuna(communeSearch);
  
  // Costo para visualización en el resumen (puede ser null si no hay comuna y no es gratis)
  const shippingCostForSummary = isFreeShipping ? 0 : baseShippingCost;

  // Valor numérico real para el cálculo del total y el envío al servidor
  const actualShippingCost = shipping.method === 'despacho' 
    ? (isFreeShipping ? 0 : (baseShippingCost ?? 0)) 
    : 0;

  const finalTotal = cartTotal + actualShippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.email || !customer.name || !shipping.streetAndNumber || !communeSearch) {
      toast({ variant: "destructive", title: "¡Faltan algunos datos!", description: "Por favor revisa los campos marcados para continuar." });
      return;
    }

    setLoading(true);

    try {
      const finalBillingInfo = {
         ...billing,
         address: sameAddress ? `${shipping.streetAndNumber} ${shipping.apartmentOrLocal}`.trim() : billing.address
      };

      const mappedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.priceAtAddition,
        subtotal: item.priceAtAddition * item.quantity,
        cartType: item.cartType
      }));

      const response = await processCheckout({
        idToken: user ? await user.getIdToken() : undefined,
        customer,
        items: mappedItems,
        shipping: { ...shipping, commune: communeSearch, cost: actualShippingCost },
        billing: finalBillingInfo,
        paymentMethod,
        total: finalTotal,
        createAccount: createAccount,
        saveAddressName: (createAccount || (user && saveNewAddress)) ? newAddressName : undefined
      });

      if (!response.success) throw new Error(response.error);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        clearCart();
        router.push(`/checkout/status?order=${response.orderId}`);
      }

    } catch (error: any) {
      toast({ variant: "destructive", title: "Tuvimos un problema", description: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-24">
      <div className="sticky top-0 z-[60] bg-white border-b border-black/5 h-12 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Finalizar Compra Segura</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-4">
        <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
           <ChevronRight className="w-3 h-3 mr-1 rotate-180" /> Volver a la tienda
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">1</div>
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-tighter">Datos de Contacto</h3>
                   </div>
                 </div>
                 {user && (
                    <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                       <User className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Sesión Iniciada</span>
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email *</Label>
                  <Mail className="absolute left-4 top-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input 
                    type="email" 
                    required
                    readOnly={!!user}
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    className={cn("h-14 rounded-2xl border-black/5 font-bold pl-12", user ? "bg-muted/50 text-muted-foreground" : "bg-muted/30")} 
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre *</Label>
                  <User className="absolute left-4 top-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input 
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold pl-12" 
                  />
                </div>
                <div className="space-y-2 relative md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono *</Label>
                  <Phone className="absolute left-4 top-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input 
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold pl-12" 
                  />
                </div>
              </div>

              {!user && (
                 <div className="pt-4 border-t border-black/5">
                    <Label className="flex items-center gap-3 cursor-pointer group w-fit">
                       <input 
                         type="checkbox" 
                         checked={createAccount}
                         onChange={(e) => setCreateAccount(e.target.checked)}
                         className="w-5 h-5 rounded-md text-primary focus:ring-primary"
                       />
                       <span className="text-sm font-bold group-hover:text-primary transition-colors">Guardar mis datos y crear una cuenta MyDog</span>
                    </Label>
                 </div>
              )}
            </section>

            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Despacho</h3>
                </div>
              </div>

              {user && savedAddresses.length > 0 && (
                <div className="mb-8">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Mis Direcciones</Label>
                  <div className="flex flex-wrap gap-3">
                    {savedAddresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => applySavedAddress(addr)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                          selectedAddressId === addr.id ? "bg-primary text-white" : "bg-white text-muted-foreground border-black/10"
                        )}
                      >
                        <MapPin className="w-3.5 h-3.5" /> {addr.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                         handleManualAddressChange();
                         setShipping({...shipping, streetAndNumber: '', apartmentOrLocal: '', commune: ''});
                         setCommuneSearch('');
                         setSaveNewAddress(true);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border border-dashed transition-all flex items-center gap-2",
                        selectedAddressId === 'manual' ? "bg-primary/5 text-primary border-primary" : "bg-muted/10 text-muted-foreground"
                      )}
                    >
                      <Plus className="w-3.5 h-3.5" /> Otra Dirección
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Label 
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all gap-3 text-center",
                    shipping.method === 'despacho' ? "border-primary bg-primary/5" : "border-black/5 bg-muted/20"
                  )}
                  onClick={() => setShipping({...shipping, method: 'despacho'})}
                >
                  <Truck className={cn("w-6 h-6", shipping.method === 'despacho' ? "text-primary" : "text-muted-foreground")} />
                  <span className="block font-black text-sm uppercase tracking-widest">A Domicilio</span>
                </Label>

                <Label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-black/5 bg-muted/20 opacity-50 cursor-not-allowed gap-3 text-center">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                  <span className="block font-black text-sm uppercase tracking-widest">Retiro (Próximamente)</span>
                </Label>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 relative md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label>
                    <Map className="absolute left-4 top-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input 
                      required
                      value={shipping.streetAndNumber}
                      onChange={(e) => {
                         setShipping({...shipping, streetAndNumber: e.target.value});
                         if(user) handleManualAddressChange();
                      }}
                      className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold pl-12" 
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Depto/Casa</Label>
                    <MapPinIcon className="absolute left-4 top-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input 
                      value={shipping.apartmentOrLocal}
                      onChange={(e) => {
                         setShipping({...shipping, apartmentOrLocal: e.target.value});
                         if(user) handleManualAddressChange();
                      }}
                      className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold pl-12" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative" ref={communeSearchRef}>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna *</Label>
                     <div className="relative">
                       <Input 
                         value={communeSearch}
                         onChange={(e) => {
                           setCommuneSearch(e.target.value);
                           setShowCommuneResults(e.target.value.trim().length > 0);
                           if(user) handleManualAddressChange();
                         }}
                         onFocus={() => { if (communeSearch.trim().length > 0) setShowCommuneResults(true); }}
                         className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 pr-10"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                         {communeSearch ? <X className="w-4 h-4 cursor-pointer" onClick={() => setCommuneSearch("")} /> : <Search className="w-4 h-4" />}
                       </div>
                     </div>

                     {showCommuneResults && communeSearch.trim().length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/[0.03] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                         <ScrollArea className="max-h-[210px] min-h-[40px]">
                           <div className="p-2 space-y-1">
                             {filteredCommunes.map((c) => (
                               <button
                                 key={c}
                                 type="button"
                                 className={cn("flex w-full items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all text-left", communeSearch === c ? "bg-primary text-white" : "hover:bg-primary/5")}
                                 onClick={() => { setCommuneSearch(c); setShowCommuneResults(false); if(user) handleManualAddressChange(); }}
                               >
                                 {c}
                                 {communeSearch === c && <Check className="w-3 h-3 text-secondary" />}
                               </button>
                             ))}
                           </div>
                         </ScrollArea>
                       </div>
                     )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Región</Label>
                    <Input value="Metropolitana" readOnly className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 opacity-60" />
                  </div>
                </div>

                {(createAccount || (user && selectedAddressId === 'manual')) && (
                  <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Label className="flex items-center gap-3 cursor-pointer group shrink-0">
                       <input 
                         type="checkbox" 
                         checked={saveNewAddress || createAccount} 
                         onChange={(e) => setSaveNewAddress(e.target.checked)}
                         disabled={createAccount}
                         className="w-5 h-5 rounded-md text-primary focus:ring-primary"
                       />
                       <span className="text-sm font-bold group-hover:text-primary transition-colors">Guardar esta dirección como:</span>
                    </Label>
                    {(saveNewAddress || createAccount) && (
                      <Input 
                         value={newAddressName}
                         onChange={(e) => setNewAddressName(e.target.value)}
                         placeholder="Ej: Casa, Oficina..." 
                         className="h-10 rounded-xl border-black/10 bg-white font-bold px-4 flex-1" 
                      />
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Facturación</h3>
                </div>
              </div>

              <div className="space-y-6">
                <Select value={billing.type} onValueChange={(val: 'boleta' | 'factura') => setBilling({...billing, type: val})}>
                  <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl">
                    <SelectItem value="boleta" className="font-bold">Boleta</SelectItem>
                    <SelectItem value="factura" className="font-bold">Factura</SelectItem>
                  </SelectContent>
                </Select>

                {billing.type === 'factura' && (
                  <div className="space-y-6 animate-in fade-in pt-4 border-t border-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input placeholder="RUT Empresa" value={billing.rut} onChange={(e) => setBilling({...billing, rut: e.target.value})} className="h-14 rounded-2xl" />
                      <Input placeholder="Razón Social" value={billing.companyName} onChange={(e) => setBilling({...billing, companyName: e.target.value})} className="h-14 rounded-2xl" />
                    </div>
                    <Input placeholder="Giro Comercial" value={billing.businessLine} onChange={(e) => setBilling({...billing, businessLine: e.target.value})} className="h-14 rounded-2xl" />
                    <Label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} className="w-5 h-5" />
                      <span className="text-sm font-bold">Misma dirección de despacho</span>
                    </Label>
                    {!sameAddress && <Input placeholder="Dirección Tributaria" value={billing.address} onChange={(e) => setBilling({...billing, address: e.target.value})} className="h-14 rounded-2xl" />}
                  </div>
                )}
              </div>
            </section>

            <PaymentSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} cartType={cartType} />

            <div className="pt-6 pb-12">
              <Button type="submit" disabled={loading} className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl">
                {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-2" /> Procesando...</> : <>Finalizar Compra ${finalTotal.toLocaleString('es-CL')} <ChevronRight className="ml-2 w-6 h-6" /></>}
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-4 mt-8 lg:mt-0 relative z-30">
            <OrderSummary shippingCost={shippingCostForSummary} />
          </aside>
        </form>
      </div>
    </div>
  );
}
