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
import { ShieldCheck, Mail, User, Phone, MapPin, Truck, ChevronRight, Loader2, Search, Check, X, MapPinIcon, Map, Plus, Building, IdCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase/client';
import { getUserData } from '@/lib/services/user.service';
import { registerUser } from '@/lib/services/auth.service';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

// Utilidad UX: Formateador de RUT Chileno en tiempo real
const formatRUT = (value: string) => {
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length === 0) return '';
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
};

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

  const { getRateForComuna } = useShippingRates();

  // 1. ESTADO DEL CLIENTE INCLUYENDO RUT
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', rut: '' });
  
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
          // 2. CARGAMOS EL RUT DEL PERFIL SI EXISTE
          setCustomer(prev => ({ 
            ...prev, 
            phone: dbData.phone || prev.phone,
            rut: dbData.rut ? formatRUT(dbData.rut) : prev.rut 
          }));
          
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

  if (cart.length === 0 && !loading) return null; 

  const isFreeShipping = cartType === 'retail' && cartTotal >= 50000;
  const baseShippingCost = getRateForComuna(communeSearch);
  const actualShippingCost = shipping.method === 'despacho' ? (isFreeShipping ? 0 : (baseShippingCost ?? null)) : 0;
  const finalTotal = cartTotal + (actualShippingCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. VALIDACIÓN ESTRICTA
    if (!customer.email || !customer.name || !customer.phone || !customer.rut || !shipping.streetAndNumber || !communeSearch) {
      toast({ 
        variant: "destructive", 
        title: "Revisa tus datos 🐾", 
        description: "Faltan campos obligatorios (*). El RUT Personal es requerido." 
      });
      return;
    }

    if (billing.type === 'factura' && (!billing.rut || !billing.companyName || !billing.businessLine)) {
      toast({ 
        variant: "destructive", 
        title: "Datos de Facturación incompletos", 
        description: "Necesitamos el RUT de Empresa, Razón Social y Giro." 
      });
      return;
    }

    setLoading(true);

    try {
      let finalUserId = user ? user.uid : "guest";

      if (!user && createAccount) {
        try {
          const randomPassword = Math.random().toString(36).slice(-12) + "Myd0g!";
          const newUserCred = await registerUser(customer.email, randomPassword, customer.name);
          finalUserId = newUserCred.user.uid;
          
          const userRef = doc(db, "users", finalUserId);
          // Actualizamos también el RUT en la creación de la cuenta
          await updateDoc(userRef, {
            rut: customer.rut.replace(/[^0-9kK\-]/g, ''), 
            addresses: arrayUnion({
              id: 'default', name: newAddressName || 'Casa', streetAndNumber: shipping.streetAndNumber, apartmentOrLocal: shipping.apartmentOrLocal || '', commune: communeSearch, region: shipping.region, isDefault: true
            })
          });
        } catch (err) {
          console.warn("No se pudo crear la cuenta localmente", err);
        }
      } else if (user && saveNewAddress && newAddressName) {
         const userRef = doc(db, "users", finalUserId);
         await updateDoc(userRef, {
           addresses: arrayUnion({
             id: Math.random().toString(36).substring(2, 9), name: newAddressName, streetAndNumber: shipping.streetAndNumber, apartmentOrLocal: shipping.apartmentOrLocal || '', commune: communeSearch, region: shipping.region, isDefault: false
           })
         });
      }

      const finalBillingInfo = {
         ...billing,
         rut: billing.type === 'factura' ? billing.rut.replace(/[^0-9kK\-]/g, '') : '',
         address: sameAddress ? `${shipping.streetAndNumber} ${shipping.apartmentOrLocal}`.trim() : billing.address
      };

      const mappedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.priceAtAddition,
        sku: item.sku || "N/A",
        cartType: item.cartType
      }));

      // Enviamos el RUT personal limpio
      const response = await processCheckout({
        userId: finalUserId,
        customer: {
          ...customer,
          rut: customer.rut.replace(/[^0-9kK\-]/g, '') 
        },
        items: mappedItems,
        shipping: { ...shipping, commune: communeSearch, cost: actualShippingCost },
        billing: finalBillingInfo,
        paymentMethod,
        total: finalTotal
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
    <div className="bg-[#F6F6F6] min-h-screen pb-24 selection:bg-primary/20">
      <div className="sticky top-0 z-[60] bg-white border-b border-black/5 h-12 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Finalizar Compra Segura</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 mt-4">
        <Link href="/catalogo" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
           <ChevronRight className="w-3 h-3 mr-1 rotate-180" /> Volver a la tienda
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <fieldset disabled={loading} className="lg:col-span-8 space-y-10 disabled:opacity-70 transition-opacity">
            
            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-10 focus-within:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">1</div>
                   <h3 className="text-xl font-black uppercase tracking-tighter">Datos de Contacto</h3>
                 </div>
                 {user && (
                    <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                       <User className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">Sesión Iniciada</span>
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email *</Label>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    required
                    readOnly={!!user}
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    className={cn("h-14 rounded-2xl border-black/5 font-bold pl-12 transition-all", user ? "bg-muted/50 text-muted-foreground" : "bg-muted/30 focus:bg-white")} 
                  />
                </div>
                <div className="space-y-2 relative group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre y Apellido *</Label>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input 
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
                  />
                </div>
                
                <div className="space-y-2 relative group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">RUT Personal *</Label>
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input 
                    required
                    placeholder="Ej: 12.345.678-9"
                    value={customer.rut}
                    onChange={(e) => setCustomer({...customer, rut: formatRUT(e.target.value)})}
                    className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
                  />
                </div>

                <div className="space-y-2 relative group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono Celular *</Label>
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                  <Input 
                    required
                    type="tel"
                    placeholder="+56 9 "
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
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
                         className="w-5 h-5 rounded-md text-primary focus:ring-primary accent-primary"
                       />
                       <span className="text-sm font-bold group-hover:text-primary transition-colors">Guardar mis datos y crear una cuenta gratis en MyDog</span>
                    </Label>
                 </div>
              )}
            </section>

            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-20 focus-within:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">2</div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Despacho</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 relative" ref={communeSearchRef}>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna *</Label>
                     <div className="relative group">
                       <Input 
                         required
                         placeholder="Escribe tu comuna..."
                         value={communeSearch}
                         onChange={(e) => {
                           setCommuneSearch(e.target.value);
                           setShowCommuneResults(e.target.value.trim().length > 0);
                         }}
                         onFocus={() => { if (communeSearch.trim().length > 0) setShowCommuneResults(true); }}
                         className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold px-6 pr-10 transition-all"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                         {communeSearch ? <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => setCommuneSearch("")} /> : <Search className="w-4 h-4" />}
                       </div>
                     </div>
                     {showCommuneResults && communeSearch.trim().length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-[100] border border-black/[0.03]">
                         <ScrollArea className="max-h-[210px]">
                           <div className="p-2 space-y-1">
                             {filteredCommunes.map((c) => (
                               <button
                                 key={c} type="button"
                                 className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all text-left hover:bg-primary/5"
                                 onClick={() => { setCommuneSearch(c); setShowCommuneResults(false); }}
                               >
                                 {c}
                               </button>
                             ))}
                           </div>
                         </ScrollArea>
                       </div>
                     )}
                  </div>
                  <div className="space-y-2 relative group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label>
                    <Input 
                      required value={shipping.streetAndNumber}
                      onChange={(e) => setShipping({...shipping, streetAndNumber: e.target.value})}
                      className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold px-6 transition-all" 
                    />
                  </div>
              </div>
            </section>

            <section className="space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-black/5 relative z-10 focus-within:border-primary/30 transition-colors">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shrink-0">3</div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Documento Tributario</h3>
              </div>

              <div className="space-y-6">
                <Select value={billing.type} onValueChange={(val: 'boleta' | 'factura') => setBilling({...billing, type: val})}>
                  <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 hover:bg-white transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl">
                    <SelectItem value="boleta" className="font-bold py-3">Boleta Electrónica</SelectItem>
                    <SelectItem value="factura" className="font-bold py-3">Factura Electrónica (Empresas)</SelectItem>
                  </SelectContent>
                </Select>

                {billing.type === 'factura' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 pt-4 border-t border-black/5">
                    <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold border border-orange-100">
                       <Building className="w-5 h-5 shrink-0 text-orange-500" />
                       <p className="mt-0.5">Asegúrate de que el RUT esté correcto para que la factura sea aceptada por el SII.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">RUT Empresa *</Label>
                        <Input 
                          required
                          placeholder="Ej: 76.123.456-7" 
                          value={billing.rut} 
                          onChange={(e) => setBilling({...billing, rut: formatRUT(e.target.value)})} 
                          className="h-14 rounded-2xl bg-muted/30 focus:bg-white font-bold transition-colors" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Razón Social *</Label>
                        <Input 
                          required
                          placeholder="Nombre legal de la empresa" 
                          value={billing.companyName} 
                          onChange={(e) => setBilling({...billing, companyName: e.target.value})} 
                          className="h-14 rounded-2xl bg-muted/30 focus:bg-white font-bold transition-colors" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giro Comercial *</Label>
                      <Input 
                        required
                        placeholder="Ej: Veterinaria, Pet Shop..." 
                        value={billing.businessLine} 
                        onChange={(e) => setBilling({...billing, businessLine: e.target.value})} 
                        className="h-14 rounded-2xl bg-muted/30 focus:bg-white font-bold transition-colors" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <PaymentSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} cartType={cartType} />

            <div className="pt-6 pb-12">
              <Button type="submit" className={cn("w-full h-16 rounded-[2rem] font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl transition-all duration-300", loading ? "bg-secondary text-primary cursor-not-allowed" : "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]")}>
                {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Procesando...</> : <>Finalizar Compra ${finalTotal.toLocaleString('es-CL')} <ChevronRight className="ml-2 w-6 h-6" /></>}
              </Button>
            </div>
          </fieldset>
          <aside className="lg:col-span-4 mt-8 lg:mt-0 relative z-30">
            <OrderSummary shippingCost={actualShippingCost} />
          </aside>
        </form>
      </div>
    </div>
  );
}