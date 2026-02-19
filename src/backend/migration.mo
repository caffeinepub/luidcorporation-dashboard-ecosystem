import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldClientRecord = {
    idLuid : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  type OldActor = {
    clientRecords : Map.Map<Text, OldClientRecord>;
    globalAnnouncement : Text;
  };

  type NewClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  type NewActor = {
    clientRecords : Map.Map<Text, NewClientRecord>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newClientRecords = old.clientRecords.map<Text, OldClientRecord, NewClientRecord>(
      func(_id, oldRecord) {
        {
          oldRecord with
          nome = "Default Name";
          senhaCliente = "DefaultPassword";
        };
      }
    );
    {
      clientRecords = newClientRecords;
      globalAnnouncement = old.globalAnnouncement;
      networkMonitoringStatus = "normal";
    };
  };
};
