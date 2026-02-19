import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSetGlobalAnnouncement, useGlobalAnnouncement, useClearGlobalAnnouncement } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Megaphone, Trash2 } from 'lucide-react';

export default function GlobalAnnouncementInput() {
  const [announcement, setAnnouncement] = useState('');
  const setGlobalAnnouncement = useSetGlobalAnnouncement();
  const clearGlobalAnnouncement = useClearGlobalAnnouncement();
  const { data: currentAnnouncement } = useGlobalAnnouncement();

  useEffect(() => {
    if (currentAnnouncement !== undefined) {
      setAnnouncement(currentAnnouncement);
    }
  }, [currentAnnouncement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await setGlobalAnnouncement.mutateAsync(announcement);
      toast.success('Aviso global atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar aviso global');
    }
  };

  const handleClear = async () => {
    try {
      await clearGlobalAnnouncement.mutateAsync();
      setAnnouncement('');
      toast.success('Aviso global removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover aviso global');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Megaphone className="h-5 w-5" />
          Aviso Global
        </CardTitle>
        <CardDescription>
          Este aviso será exibido para todos os clientes em seus dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement">Mensagem do Aviso</Label>
            <Textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Digite o aviso que será exibido para todos os clientes..."
              rows={4}
              className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={setGlobalAnnouncement.isPending}
              className="flex-1 bg-neon-green text-carbon-black hover:bg-neon-green/90"
            >
              {setGlobalAnnouncement.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Aviso Global'
              )}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleClear}
              disabled={clearGlobalAnnouncement.isPending || !announcement}
              className="bg-red-600 hover:bg-red-700"
            >
              {clearGlobalAnnouncement.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
