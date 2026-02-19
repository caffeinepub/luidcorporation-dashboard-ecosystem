import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  type OldActor = {
    clientRecords : Map.Map<Text, OldClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  type NewActor = {
    clientRecords : Map.Map<Text, {
      idLuid : Text;
      nome : Text;
      senhaCliente : Text;
      ipVps : Text;
      userVps : Text;
      senhaVps : Text;
      plano : Text;
      vmStatus : { #online; #offline; #maintenance };
    }>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatMessages : Map.Map<Text, List.List<{ sender : Text; receiver : Text; message : Text; timestamp : Int }>>;
  };

  public func run(old : OldActor) : NewActor {
    let newClientRecords = old.clientRecords.map<Text, OldClientRecord, {
      idLuid : Text;
      nome : Text;
      senhaCliente : Text;
      ipVps : Text;
      userVps : Text;
      senhaVps : Text;
      plano : Text;
      vmStatus : { #online; #offline; #maintenance };
    }>(
      func(_id, oldRecord) {
        { oldRecord with vmStatus = #online };
      }
    );

    {
      old with
      clientRecords = newClientRecords;
      chatMessages = Map.empty<Text, List.List<{ sender : Text; receiver : Text; message : Text; timestamp : Int }>>();
    };
  };
};
