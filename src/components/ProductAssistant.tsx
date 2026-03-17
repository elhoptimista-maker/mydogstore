
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Dog, ArrowRight } from 'lucide-react';
import { intelligentProductAssistant, type IntelligentProductAssistantOutput } from '@/ai/flows/intelligent-product-assistant';

export default function ProductAssistant() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IntelligentProductAssistantOutput | null>(null);
  const [form, setForm] = useState({
    dogBreed: '',
    dogAge: '',
    specificNeeds: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await intelligentProductAssistant(form);
      setResults(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <Card className="glass overflow-hidden border-none shadow-xl rounded-3xl">
        <CardHeader className="bg-primary/5 p-8 text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dog className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-headline text-primary font-bold">
            Personalized Dog Advisor
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Our AI finds the perfect matches based on your dog's unique profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {!results ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="breed">What's their breed?</Label>
                  <Input 
                    id="breed" 
                    placeholder="e.g. Golden Retriever" 
                    className="rounded-xl border-primary/20 focus-visible:ring-primary"
                    value={form.dogBreed}
                    onChange={e => setForm({...form, dogBreed: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">How old are they?</Label>
                  <Input 
                    id="age" 
                    placeholder="e.g. 2 years or Puppy" 
                    className="rounded-xl border-primary/20 focus-visible:ring-primary"
                    value={form.dogAge}
                    onChange={e => setForm({...form, dogAge: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="needs">Any specific needs or sensitivities?</Label>
                <Input 
                  id="needs" 
                  placeholder="e.g. joint support, picky eater" 
                  className="rounded-xl border-primary/20 focus-visible:ring-primary"
                  value={form.specificNeeds}
                  onChange={e => setForm({...form, specificNeeds: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Dog Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                {results.recommendations.map((rec, i) => (
                  <div key={i} className="p-6 bg-secondary/30 rounded-2xl border border-secondary/50 group">
                    <h4 className="text-lg font-bold text-primary mb-1">{rec.productName}</h4>
                    <p className="text-sm text-foreground/80 mb-3">{rec.productDescription}</p>
                    <div className="text-xs bg-white/50 p-3 rounded-lg text-primary-foreground/80 italic">
                      <span className="font-bold text-primary not-italic">Expert Tip:</span> {rec.reasonForRecommendation}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-primary text-primary hover:bg-primary/5"
                onClick={() => setResults(null)}
              >
                Start Over
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
