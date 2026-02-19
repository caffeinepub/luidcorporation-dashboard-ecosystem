import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type VMStatus = { #online; #offline; #maintenance };

  type ClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
    vmStatus : VMStatus;
  };

  type Notification = {
    message : Text;
    timestamp : Int;
  };

  type ChatMessage = {
    sender : Text;
    receiver : Text;
    message : Text;
    timestamp : Int;
  };

  type ChatSystemStatus = { #online; #offline };

  type OldActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    notifications : Map.Map<Text, List.List<Notification>>;
    chatMessages : Map.Map<Text, List.List<ChatMessage>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  type NewActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    notifications : Map.Map<Text, List.List<Notification>>;
    chatMessages : Map.Map<Text, List.List<ChatMessage>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    chatSystemStatus : ChatSystemStatus;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      chatSystemStatus = #offline
    };
  };
};
