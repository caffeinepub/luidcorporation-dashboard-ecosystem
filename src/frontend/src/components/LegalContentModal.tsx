import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'terms' | 'privacy';
}

export default function LegalContentModal({ isOpen, onClose, title, type }: LegalContentModalProps) {
  const termsContent = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>
        Bem-vindo à LuidCorporation. Ao utilizar nossos serviços, você concorda com os seguintes termos e condições.
      </p>
      
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">1. Aceitação dos Termos</h3>
        <p>
          Ao acessar e usar este serviço, você aceita e concorda em estar vinculado aos termos e condições deste acordo.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">2. Uso do Serviço</h3>
        <p>
          Você concorda em usar o serviço apenas para fins legais e de acordo com todas as leis e regulamentos aplicáveis.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">3. Conta de Usuário</h3>
        <p>
          Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">4. Propriedade Intelectual</h3>
        <p>
          Todo o conteúdo e materiais disponíveis no serviço são propriedade da LuidCorporation e protegidos por leis de propriedade intelectual.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">5. Limitação de Responsabilidade</h3>
        <p>
          A LuidCorporation não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar o serviço.
        </p>
      </div>

      <p className="text-xs italic">
        Este é um documento genérico de exemplo. O conteúdo real será atualizado pelo administrador.
      </p>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>
        A LuidCorporation está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
      </p>
      
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">1. Informações Coletadas</h3>
        <p>
          Coletamos informações que você nos fornece diretamente, como nome, ID de cliente, endereço IP e credenciais de acesso.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">2. Uso das Informações</h3>
        <p>
          Usamos suas informações para fornecer, manter e melhorar nossos serviços, bem como para comunicar com você sobre sua conta e serviços.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">3. Compartilhamento de Informações</h3>
        <p>
          Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">4. Segurança</h3>
        <p>
          Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração ou destruição.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">5. Seus Direitos</h3>
        <p>
          Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco para exercer esses direitos.
        </p>
      </div>

      <p className="text-xs italic">
        Este é um documento genérico de exemplo. O conteúdo real será atualizado pelo administrador.
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-neon-green/20 bg-card-dark">
        <DialogHeader>
          <DialogTitle className="text-neon-green">{title}</DialogTitle>
          <DialogDescription>
            {type === 'terms' 
              ? 'Termos e condições de uso do serviço LuidCorporation'
              : 'Como coletamos, usamos e protegemos suas informações'
            }
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {type === 'terms' ? termsContent : privacyContent}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
