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
import { ShieldCheck, Mail, User, Phone, MapPin, Truck, ChevronRight, Loader2, Search, Check, X, MapPinIcon, Map, Plus, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase/client';
import { getUserData, registerUser } from '@/lib/services/user.service';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

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
  
  const actualShippingCost = shipping.method === 'despacho' 
    ? (isFreeShipping ? 0 : (baseShippingCost ?? null)) 
    : 0;

  const finalTotal = cartTotal + (actualShippingCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.email || !customer.name || !shipping.streetAndNumber || !communeSearch) {
      toast({ 
        variant: "destructive", 
        title: "Revisa tus datos 🐾", 
        description: "Faltan campos obligatorios (*)." 
      });
      return;
    }

    if (billing.type === 'factura' && (!billing.rut || !billing.companyName || !billing.businessLine)) {
      toast({ 
        variant: "destructive", 
        title: "Datos incompletos", 
        description: "Necesitamos tu RUT, Razón Social y Giro." 
      });
      return;
    }

    setLoading(true);

    try {
      let finalUserId = user ? user.uid : "guest";

      // LÓGICA CON SDK DEL CLIENTE: Creación de cuenta y guardado de direcciones
      if (!user && createAccount) {
        try {
          const randomPassword = Math.random().toString(36).slice(-12) + "Myd0g!";
          const newUserCred = await registerUser({
            email: customer.email,
            password: randomPassword,
            displayName: customer.name
          });
          finalUserId = newUserCred.user.uid;
          
          // Guardamos su primera dirección usando Firestore Client SDK
          const userRef = doc(db, "users", finalUserId);
          await updateDoc(userRef, {
            addresses: arrayUnion({
              id: 'default',
              name: newAddressName || 'Casa',
              streetAndNumber: shipping.streetAndNumber,
              apartmentOrLocal: shipping.apartmentOrLocal || '',
              commune: communeSearch,
              region: shipping.region,
              isDefault: true
            })
          });
        } catch (err) {
          console.warn("No se pudo crear la cuenta localmente", err);
        }
      } else if (user && saveNewAddress && newAddressName) {
         // Guardar nueva dirección para un usuario ya logueado
         const userRef = doc(db, "users", finalUserId);
         await updateDoc(userRef, {
           addresses: arrayUnion({
             id: Math.random().toString(36).substring(2, 9),
             name: newAddressName,
             streetAndNumber: shipping.streetAndNumber,
             apartmentOrLocal: shipping.apartmentOrLocal || '',
             commune: communeSearch,
             region: shipping.region,
             isDefault: false
           })
         });
      }

      // Preparar datos finales para el Server Action
      const finalBillingInfo = {
         ...billing,
         rut: billing.type === 'factura' ? billing.rut.replace(/[^0-9kK]/g, '') : '',
         address: sameAddress ? `${shipping.streetAndNumber} ${shipping.apartmentOrLocal}`.trim() : billing.address
      };

      const mappedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.priceAtAddition,
        sku: item.sku || "N/A", // Aseguramos el SKU
        cartType: item.cartType
      }));

      // Llamada limpia al Server Action (Solo como puente de comunicación)
      const response = await processCheckout({
        userId: finalUserId,
        customer,
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
          <fieldset disabled={loading} className="lg:col-span-8 space-y-10 disabled:opacity-70 transition-opacity outline-none border-none p-0 m-0">
            
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
                  <div className="relative">
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
                </div>
                <div className="space-y-2 relative group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre y Apellido *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2 relative md:col-span-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono Celular *</Label>
                  <div className="relative">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Label 
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all gap-3 text-center",
                    shipping.method === 'despacho' ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-black/5 bg-white hover:bg-muted/20"
                  )}
                  onClick={() => setShipping({...shipping, method: 'despacho'})}
                >
                  <Truck className="w-6 h-6" />
                  <span className="block font-black text-sm uppercase tracking-widest">A Domicilio en RM</span>
                </Label>
                <Label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-black/5 bg-muted/20 opacity-40 cursor-not-allowed gap-3 text-center">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                  <span className="block font-black text-sm uppercase tracking-widest text-muted-foreground">Retiro (Próximamente)</span>
                </Label>
              </div>

              {user && savedAddresses.length > 0 && (
                <div className="mb-8">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Mis Direcciones Guardadas</Label>
                  <div className="flex flex-wrap gap-3">
                    {savedAddresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => applySavedAddress(addr)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                          selectedAddressId === addr.id ? "bg-primary text-white shadow-md border-primary" : "bg-white text-muted-foreground border-black/10 hover:bg-muted/50"
                        )}
                      >
                        <MapPin className="w-3.5 h-3.5" /> {addr.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                         setSelectedAddressId('manual');
                         setShipping({...shipping, streetAndNumber: '', apartmentOrLocal: '', commune: ''});
                         setCommuneSearch('');
                         setSaveNewAddress(true);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border border-dashed transition-all flex items-center gap-2",
                        selectedAddressId === 'manual' ? "bg-primary/5 text-primary border-primary" : "bg-white text-muted-foreground hover:bg-muted/30"
                      )}
                    >
                      <Plus className="w-3.5 h-3.5" /> Otra Dirección
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 relative md:col-span-2 group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label>
                    <div className="relative">
                      <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input 
                        required
                        placeholder="Ej: Av. Providencia 1234"
                        value={shipping.streetAndNumber}
                        onChange={(e) => {
                           setShipping({...shipping, streetAndNumber: e.target.value});
                           if(user) setSelectedAddressId('manual');
                        }}
                        className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative group">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Depto/Casa</Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Ej: Depto 402"
                        value={shipping.apartmentOrLocal}
                        onChange={(e) => {
                           setShipping({...shipping, apartmentOrLocal: e.target.value});
                           if(user) setSelectedAddressId('manual');
                        }}
                        className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold pl-12 transition-all" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative" ref={communeSearchRef}>
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna (Región Metropolitana) *</Label>
                     <div className="relative group">
                       <Input 
                         required
                         placeholder="Escribe tu comuna..."
                         value={communeSearch}
                         onChange={(e) => {
                           setCommuneSearch(e.target.value);
                           setShowCommuneResults(e.target.value.trim().length > 0);
                           if(user) setSelectedAddressId('manual');
                         }}
                         onFocus={() => { if (communeSearch.trim().length > 0) setShowCommuneResults(true); }}
                         className="h-14 rounded-2xl border-black/5 bg-muted/30 focus:bg-white font-bold px-6 pr-10 transition-all"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                         {communeSearch ? <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => setCommuneSearch("")} /> : <Search className="w-4 h-4" />}
                       </div>
                     </div>

                     {showCommuneResults && communeSearch.trim().length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/[0.03] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                         <ScrollArea className="max-h-[210px] min-h-[40px]">
                           <div className="p-2 space-y-1">
                             {filteredCommunes.length > 0 ? filteredCommunes.map((c) => (
                               <button
                                 key={c}
                                 type="button"
                                 className={cn("flex w-full items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all text-left", communeSearch === c ? "bg-primary text-white" : "hover:bg-primary/5 text-foreground")}
                                 onClick={() => { setCommuneSearch(c); setShowCommuneResults(false); if(user) setSelectedAddressId('manual'); }}
                               >
                                 {c}
                                 {communeSearch === c && <Check className="w-3 h-3 text-white" />}
                               </button>
                             )) : (
                               <div className="px-4 py-3 text-xs font-bold text-muted-foreground text-center">No encontramos esa comuna en la RM</div>
                             )}
                           </div>
                         </ScrollArea>
                       </div>
                     )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Región</Label>
                    <Input value="Metropolitana" readOnly className="h-14 rounded-2xl border-black/5 bg-muted/10 text-muted-foreground font-bold px-6 opacity-80 cursor-not-allowed" />
                  </div>
                </div>

                {(createAccount || (user && selectedAddressId === 'manual')) && (
                  <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center gap-4 bg-primary/5 p-4 rounded-2xl">
                    <Label className="flex items-center gap-3 cursor-pointer group shrink-0">
                       <input 
                         type="checkbox" 
                         checked={saveNewAddress || createAccount} 
                         onChange={(e) => setSaveNewAddress(e.target.checked)}
                         disabled={createAccount}
                         className="w-5 h-5 rounded-md text-primary focus:ring-primary accent-primary"
                       />
                       <span className="text-sm font-bold text-primary">Guardar esta dirección para la próxima:</span>
                    </Label>
                    {(saveNewAddress || createAccount) && (
                      <Input 
                         value={newAddressName}
                         onChange={(e) => setNewAddressName(e.target.value)}
                         placeholder="Ej: Casa, Oficina..." 
                         className="h-10 rounded-xl border-black/10 bg-white font-bold px-4 flex-1 shadow-sm" 
                      />
                    )}
                  </div>
                )}
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
                        placeholder="Ej: Veterinaria, Pet Shop, Comercializadora..." 
                        value={billing.businessLine} 
                        onChange={(e) => setBilling({...billing, businessLine: e.target.value})} 
                        className="h-14 rounded-2xl bg-muted/30 focus:bg-white font-bold transition-colors" 
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Label className="flex items-center gap-3 cursor-pointer w-fit group">
                        <input type="checkbox" checked={sameAddress} onChange={(e) => setSameAddress(e.target.checked)} className="w-5 h-5 rounded-md accent-primary" />
                        <span className="text-sm font-bold group-hover:text-primary transition-colors">La dirección tributaria es la misma del despacho</span>
                      </Label>
                    </div>
                    
                    {!sameAddress && (
                      <div className="space-y-2 animate-in fade-in pt-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Dirección Tributaria *</Label>
                         <Input 
                           required
                           placeholder="Ingresa la dirección fiscal de la empresa" 
                           value={billing.address} 
                           onChange={(e) => setBilling({...billing, address: e.target.value})} 
                           className="h-14 rounded-2xl bg-muted/30 focus:bg-white font-bold transition-colors" 
                         />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <PaymentSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} cartType={cartType} />

            <div className="pt-6 pb-12">
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-16 rounded-[2rem] font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl transition-all duration-300",
                  loading ? "bg-secondary text-primary cursor-not-allowed" : "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {loading ? (
                  <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Procesando pago seguro...</>
                ) : (
                  <>Finalizar Compra ${finalTotal.toLocaleString('es-CL')} <ChevronRight className="ml-2 w-6 h-6" /></>
                )}
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
