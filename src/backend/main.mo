import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Run "mo:core/Runtime";
import Migration "migration";
import Iter "mo:core/Iter";

(with migration = Migration.run)
actor {
  type VMStatus = {
    #online;
    #offline;
    #maintenance;
  };

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

  type AdminCredentials = {
    username : Text;
    password : Text;
  };

  type ChatMessage = {
    sender : Text;
    message : Text;
    timestamp : Int;
  };

  type Notification = {
    message : Text;
    timestamp : Int;
  };

  let clientRecords = Map.empty<Text, ClientRecord>();
  let notifications = Map.empty<Text, List.List<Notification>>();
  let chatMessages = Map.empty<Text, List.List<ChatMessage>>();
  let adminAccounts = Map.empty<Text, AdminCredentials>();
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
    vmStatus : VMStatus,
  ) : async () {
    if (clientRecords.containsKey(idLuid)) {
      Run.trap("Client with this ID_Luid already exists.");
    };

    let record : ClientRecord = {
      idLuid;
      nome;
      senhaCliente;
      ipVps;
      userVps;
      senhaVps;
      plano;
      vmStatus;
    };

    clientRecords.add(idLuid, record);
    notifications.add(idLuid, List.empty<Notification>());
    chatMessages.add(idLuid, List.empty<ChatMessage>());
  };

  public shared ({ caller }) func updateClientRecord(
    idLuid : Text,
    nome : Text,
    senhaCliente : Text,
    ipVps : Text,
    userVps : Text,
    senhaVps : Text,
    plano : Text,
    vmStatus : VMStatus,
  ) : async () {
    switch (clientRecords.get(idLuid)) {
      case (null) {
        Run.trap("Client record not found");
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
          vmStatus;
        };
        clientRecords.add(idLuid, updatedRecord);
      };
    };
  };

  public shared ({ caller }) func updateVMStatus(idLuid : Text, status : VMStatus) : async () {
    switch (clientRecords.get(idLuid)) {
      case (null) { Run.trap("Client record not found") };
      case (?record) {
        let updatedRecord : ClientRecord = {
          record with vmStatus = status
        };
        clientRecords.add(idLuid, updatedRecord);
      };
    };
  };

  public query ({ caller }) func getClientRecord(idLuid : Text) : async ClientRecord {
    switch (clientRecords.get(idLuid)) {
      case (null) { Run.trap("Client record not found") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getAllClientRecords() : async [ClientRecord] {
    clientRecords.values().toArray();
  };

  public shared ({ caller }) func deleteClientRecord(idLuid : Text) : async () {
    if (not clientRecords.containsKey(idLuid)) {
      Run.trap("Client record does not exist");
    };
    clientRecords.remove(idLuid);
    notifications.remove(idLuid);
    chatMessages.remove(idLuid);
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
      Run.trap("Invalid network status");
    };
    networkMonitoringStatus := status;
  };

  public query ({ caller }) func getNetworkMonitoringStatus() : async Text {
    networkMonitoringStatus;
  };

  public shared ({ caller }) func addNotification(clientId : Text, message : Text) : async () {
    let newNotification : Notification = {
      message;
      timestamp = 0;
    };

    switch (notifications.get(clientId)) {
      case (null) {
        let notificationList = List.empty<Notification>();
        notificationList.add(newNotification);
        notifications.add(clientId, notificationList);
      };
      case (?existingNotifications) {
        existingNotifications.add(newNotification);
      };
    };
  };

  public query ({ caller }) func getNotifications(clientId : Text) : async [Notification] {
    switch (notifications.get(clientId)) {
      case (null) { [] };
      case (?notificationList) { notificationList.toArray() };
    };
  };

  public shared ({ caller }) func clearNotifications(clientId : Text) : async () {
    notifications.add(clientId, List.empty<Notification>());
  };

  public shared ({ caller }) func addAdminAccount(username : Text, password : Text) : async () {
    if (adminAccounts.containsKey(username)) {
      Run.trap("Admin account with this username already exists.");
    };
    let credentials : AdminCredentials = { username; password };
    adminAccounts.add(username, credentials);
  };

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Bool {
    switch (adminAccounts.get(username)) {
      case (null) { false };
      case (?creds) { creds.password == password };
    };
  };

  public shared ({ caller }) func sendMessage(sender : Text, message : Text) : async () {
    let newMessage : ChatMessage = {
      sender;
      message;
      timestamp = 0;
    };
    switch (chatMessages.get(sender)) {
      case (null) {
        let messageList = List.empty<ChatMessage>();
        messageList.add(newMessage);
        chatMessages.add(sender, messageList);
      };
      case (?existingMessages) {
        existingMessages.add(newMessage);
      };
    };
  };

  public query ({ caller }) func getChatMessages(userId : Text) : async [ChatMessage] {
    switch (chatMessages.get(userId)) {
      case (null) { [] };
      case (?messageList) { messageList.toArray() };
    };
  };

  public shared ({ caller }) func clearChatMessages(userId : Text) : async () {
    chatMessages.add(userId, List.empty<ChatMessage>());
  };
};
