import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Migration "migration";

// Add migration to backend actor
(with migration = Migration.run)
actor {
  type ClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  let clientRecords = Map.empty<Text, ClientRecord>();
  var globalAnnouncement : Text = "";
  var networkMonitoringStatus : Text = "normal";

  public shared ({ caller }) func createClientRecord(
    idLuid : Text,
    nome : Text,
    senhaCliente : Text,
    ipVps : Text,
    userVps : Text,
    senhaVps : Text,
    plano : Text,
  ) : async () {
    if (clientRecords.containsKey(idLuid)) {
      Runtime.trap("Client with this ID_Luid already exists.");
    };

    let record : ClientRecord = {
      idLuid;
      nome;
      senhaCliente;
      ipVps;
      userVps;
      senhaVps;
      plano;
    };

    clientRecords.add(idLuid, record);
  };

  public shared ({ caller }) func updateClientRecord(
    idLuid : Text,
    nome : Text,
    senhaCliente : Text,
    ipVps : Text,
    userVps : Text,
    senhaVps : Text,
    plano : Text,
  ) : async () {
    switch (clientRecords.get(idLuid)) {
      case (null) {
        Runtime.trap("Client record not found");
      };
      case (?_existingRecord) {
        let updatedRecord : ClientRecord = {
          idLuid;
          nome;
          senhaCliente;
          ipVps;
          userVps;
          senhaVps;
          plano;
        };
        clientRecords.add(idLuid, updatedRecord);
      };
    };
  };

  public query ({ caller }) func getClientRecord(idLuid : Text) : async ClientRecord {
    switch (clientRecords.get(idLuid)) {
      case (null) { Runtime.trap("Client record not found") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getAllClientRecords() : async [ClientRecord] {
    let recordsList = List.empty<ClientRecord>();
    for ((_, record) in clientRecords.entries()) {
      recordsList.add(record);
    };
    recordsList.toArray();
  };

  public shared ({ caller }) func deleteClientRecord(idLuid : Text) : async () {
    if (not clientRecords.containsKey(idLuid)) {
      Runtime.trap("Client record does not exist");
    };
    clientRecords.remove(idLuid);
  };

  public shared ({ caller }) func setGlobalAnnouncement(announcement : Text) : async () {
    globalAnnouncement := announcement;
  };

  public shared ({ caller }) func clearGlobalAnnouncement() : async () {
    globalAnnouncement := "";
  };

  public query ({ caller }) func getGlobalAnnouncement() : async Text {
    globalAnnouncement;
  };

  public shared ({ caller }) func updateNetworkMonitoringStatus(status : Text) : async () {
    if (status != "normal" and status != "offline") {
      Runtime.trap("Invalid network status");
    };
    networkMonitoringStatus := status;
  };

  public query ({ caller }) func getNetworkMonitoringStatus() : async Text {
    networkMonitoringStatus;
  };
};
