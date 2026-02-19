import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type ClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  type OldActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  type NewActor = {
    clientRecords : Map.Map<Text, ClientRecord>;
    notifications : Map.Map<Text, List.List<{ message : Text; timestamp : Int }>>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  public func run(old : OldActor) : NewActor {
    let notifications = Map.empty<Text, List.List<{ message : Text; timestamp : Int }>>();
    { old with notifications };
  };
};
