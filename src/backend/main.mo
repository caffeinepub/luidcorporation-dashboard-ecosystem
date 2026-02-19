import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  let clientRecords = Map.empty<Text, ClientRecord>();
  let notifications = Map.empty<Text, List.List<Notification>>();
  let chatMessages = Map.empty<Text, List.List<ChatMessage>>();

  var globalAnnouncement : Text = "";
  var networkMonitoringStatus : Text = "normal";
  var chatSystemStatus : ChatSystemStatus = #offline;

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
          vmStatus;
        };
        clientRecords.add(idLuid, updatedRecord);
      };
    };
  };

  public shared ({ caller }) func updateVMStatus(idLuid : Text, vmStatus : VMStatus) : async () {
    switch (clientRecords.get(idLuid)) {
      case (null) {
        Runtime.trap("Client record not found");
      };
      case (?existing) {
        let updatedRecord = { existing with vmStatus };
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
      Runtime.trap("Invalid network status");
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

  public shared ({ caller }) func sendMessage(sender : Text, receiver : Text, message : Text) : async () {
    if (chatSystemStatus == #offline) {
      Runtime.trap("Chat system is currently offline");
    };

    let newMessage : ChatMessage = {
      sender;
      receiver;
      message;
      timestamp = 0;
    };

    // Store message for sender
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

    // Store message for receiver
    switch (chatMessages.get(receiver)) {
      case (null) {
        let messageList = List.empty<ChatMessage>();
        messageList.add(newMessage);
        chatMessages.add(receiver, messageList);
      };
      case (?existingMessages) {
        existingMessages.add(newMessage);
      };
    };
  };

  public query ({ caller }) func getMessages(clientId : Text) : async [ChatMessage] {
    switch (chatMessages.get(clientId)) {
      case (null) { [] };
      case (?messageList) { messageList.toArray() };
    };
  };

  public shared ({ caller }) func clearMessages(clientId : Text) : async () {
    chatMessages.add(clientId, List.empty<ChatMessage>());
  };

  public shared ({ caller }) func setChatSystemStatus(status : ChatSystemStatus) : async () {
    chatSystemStatus := status;
  };

  public query ({ caller }) func getChatSystemStatus() : async ChatSystemStatus {
    chatSystemStatus;
  };
};
