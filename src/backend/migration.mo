import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";

module {
  type VMStatus = { #online; #offline; #maintenance };
  type OperatingSystem = { #windows; #ubuntu };

  type OldClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
    vmStatus : VMStatus;
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
    operatingSystem : OperatingSystem;
    planExpiry : Time.Time;
  };

  type OldActor = {
    clientRecords : Map.Map<Text, OldClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    chatMessages : Map.Map<Text, List.List<{ sender : Text; receiver : Text; message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatSystemStatus : { #online; #offline };
  };

  type NewActor = {
    clientRecords : Map.Map<Text, NewClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    chatMessages : Map.Map<Text, List.List<{ sender : Text; receiver : Text; message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatSystemStatus : { #online; #offline };
  };

  public func run(old : OldActor) : NewActor {
    let newClientRecords = old.clientRecords.map<Text, OldClientRecord, NewClientRecord>(
      func(_id, oldRecord) {
        {
          oldRecord with
          operatingSystem = #windows; // Default to windows, should be updated later
          planExpiry = 0; // Default to 0, should be updated later
        };
      }
    );
    {
      old with
      clientRecords = newClientRecords;
    };
  };
};
