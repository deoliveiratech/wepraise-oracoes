import { useState, useEffect } from 'react';
import { GlassCard, Button, cn } from '../components/UI';
import { Heart, Plus, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Prayer {
  id: string;
  title: string;
  category: string;
  content: string;
}

export default function Prayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const q = query(collection(db, 'prayers'));
      const snapshot = await getDocs(q);
      
      const prayersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prayer[];

      // Check if some base prayers are missing to trigger a re-seed
      const baseIds = ['pai-nosso', 'ave-maria', 'credo', 'gloria-ao-pai', 'jaculatoria', 'salve-rainha', 'santo-anjo', 'vinde-espirito-santo', 'alma-de-cristo', 'consagracao-nossa-senhora'];
      const missingBase = baseIds.some(id => !prayersList.find(p => p.id === id));
      
      if (snapshot.empty || missingBase) {
        await seedPrayers();
        return;
      }
      
      setPrayers(prayersList);
    } catch (error) {
      console.error('Erro ao buscar orações:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedPrayers = async () => {
    const initialPrayers = [
      { 
        id: 'pai-nosso',
        title: 'Pai Nosso', 
        category: 'Base',
        content: 'Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.'
      },
      { 
        id: 'ave-maria',
        title: 'Ave Maria', 
        category: 'Base',
        content: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.'
      },
      { 
        id: 'credo',
        title: 'Credo', 
        category: 'Base',
        content: 'Creio em Deus Pai todo-poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.'
      },
      { 
        id: 'gloria-ao-pai',
        title: 'Glória ao Pai', 
        category: 'Base',
        content: 'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.'
      },
      { 
        id: 'jaculatoria',
        title: 'Ó meu Jesus (Jaculatória)', 
        category: 'Terço',
        content: 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem. Amém.'
      },
      { 
        id: 'salve-rainha',
        title: 'Salve Rainha', 
        category: 'Base',
        content: 'Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus. Para que sejamos dignos das promessas de Cristo. Amém.'
      },
      { 
        id: 'santo-anjo',
        title: 'Santo Anjo', 
        category: 'Crianças/Proteção',
        content: 'Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarde, me governe, me ilumine. Amém.'
      },
      { 
        id: 'vinde-espirito-santo',
        title: 'Vinde Espírito Santo', 
        category: 'Espírito Santo',
        content: 'Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Enviai o vosso Espírito e tudo será criado, e renovareis a face da terra. Oremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre da sua consolação. Por Cristo, Senhor nosso. Amém.'
      },
      { 
        id: 'alma-de-cristo',
        title: 'Alma de Cristo', 
        category: 'Eucaristia',
        content: 'Alma de Cristo, santificai-me. Corpo de Cristo, salvai-me. Sangue de Cristo, inebriai-me. Água do lado de Cristo, lavai-me. Paixão de Cristo, confortai-me. Ó bom Jesus, ouvi-me. Dentro de vossas chagas, escondei-me. Não permitais que me separe de Vós. Do espírito maligno, defendei-me. Na hora da minha morte, chamai-me e mandai-me ir para Vós, para que com os vossos Santos Vos louve por todos os séculos dos séculos. Amém.'
      },
      { 
        id: 'consagracao-nossa-senhora',
        title: 'Consagração a Nossa Senhora', 
        category: 'Mariana',
        content: 'Ó minha Senhora, ó minha Mãe, eu me ofereço todo a vós e, em prova da minha devota afeição para convosco, vos consagro neste dia e para sempre, os meus olhos, os meus ouvidos, a minha boca, as minhas mãos, o meu coração e, inteiramente, todo o meu ser. E porque assim sou vosso, ó incomparável Mãe, guardai-me e defendei-me como coisa e propriedade vossa. Amém.'
      },
    ];

    for (const prayer of initialPrayers) {
      const { id, ...data } = prayer;
      await setDoc(doc(db, 'prayers', id), {
        ...data,
        createdAt: serverTimestamp(),
        isPublic: true
      });
    }
    
    fetchPrayers();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredPrayers = prayers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Orações</h1>
        <Button variant="primary" className="p-2 rounded-full">
          <Plus size={20} />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Buscar oração..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="text-indigo-500 animate-spin" size={40} />
          <p className="text-slate-500 text-sm">Buscando orações no céu...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrayers.map((prayer) => (
            <GlassCard 
              key={prayer.id} 
              className={cn(
                "p-0 overflow-hidden transition-all duration-300",
                expandedId === prayer.id ? "ring-1 ring-indigo-500/50" : ""
              )}
            >
              <button 
                onClick={() => toggleExpand(prayer.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    expandedId === prayer.id ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-400"
                  )}>
                    <Heart size={20} fill={expandedId === prayer.id ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{prayer.title}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{prayer.category}</p>
                  </div>
                </div>
                {expandedId === prayer.id ? (
                  <ChevronUp size={18} className="text-indigo-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedId === prayer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="h-px w-full bg-white/5 mb-4" />
                      <p className="text-sm text-slate-300 leading-relaxed italic">
                        {prayer.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
          {filteredPrayers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 text-sm">Nenhuma oração encontrada.</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center py-6 opacity-30">
        <Heart size={32} className="mx-auto mb-2" />
        <p className="text-xs italic">"A oração é a respiração da alma"</p>
      </div>
    </div>
  );
}
