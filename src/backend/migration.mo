import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type VMStatus = {
    #online;
    #offline;
    #maintenance;
  };

  type OldClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  type NewClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
    vmStatus : VMStatus;
  };

  type OldActor = {
    clientRecords : Map.Map<Text, OldClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  type NewActor = {
    clientRecords : Map.Map<Text, NewClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    chatMessages : Map.Map<Text, List.List<{ sender : Text; message : Text; timestamp : Int }>>;
    adminAccounts : Map.Map<Text, { username : Text; password : Text }>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newClientRecords = old.clientRecords.map<Text, OldClientRecord, NewClientRecord>(
      func(_id, client) {
        { client with vmStatus = #online };
      }
    );

    {
      old with
      clientRecords = newClientRecords;
      chatMessages = Map.empty<Text, List.List<{ sender : Text; message : Text; timestamp : Int }>>();
      adminAccounts = Map.empty<Text, { username : Text; password : Text }>();
    };
  };
};
