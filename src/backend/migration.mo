import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  public type VMStatus = { #online; #offline; #maintenance };
  public type OperatingSystem = { #windows; #ubuntu };

  public type ClientRecord = {
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

  public type Notification = {
    message : Text;
    timestamp : Int;
  };

  public type ChatMessage = {
    sender : Text;
    receiver : Text;
    message : Text;
    timestamp : Int;
  };

  public type ChatSystemStatus = { #online; #offline };

  public type AccessLog = {
    clientId : Text;
    timestamp : Time.Time;
    ipAddress : Text;
  };

  public type OldActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    notifications : Map.Map<Text, List.List<Notification>>;
    chatMessages : Map.Map<Text, List.List<ChatMessage>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatSystemStatus : ChatSystemStatus;
  };

  public type NewActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    notifications : Map.Map<Text, List.List<Notification>>;
    chatMessages : Map.Map<Text, List.List<ChatMessage>>;
    accessLogs : List.List<AccessLog>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatSystemStatus : ChatSystemStatus;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      accessLogs = List.empty<AccessLog>()
    };
  };
};
