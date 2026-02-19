import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type required by frontend
  public type UserProfile = {
    employeeId : Text;
    name : Text;
    role : Text; // 'Master' or 'Employee'
  };

  type Employee = {
    employeeId : Text;
    name : Text;
    password : Text;
    role : Text; // 'Master' or 'Employee'
  };

  type ClientRecord = {
    idLuid : Text;
    nome : Text;
    senhaCliente : Text;
    ipVps : Text;
    userVps : Text;
    senhaVps : Text;
    plano : Text;
  };

  let employees = Map.empty<Text, Employee>();
  let employeePrincipals = Map.empty<Principal, Text>(); // Maps Principal to employeeId
  let clientRecords = Map.empty<Text, ClientRecord>();
  var globalAnnouncement : Text = "";
  var networkMonitoringStatus : Text = "normal";

  // Helper function to check if caller is Master
  func isMaster(caller : Principal) : Bool {
    switch (employeePrincipals.get(caller)) {
      case (null) { false };
      case (?employeeId) {
        switch (employees.get(employeeId)) {
          case (null) { false };
          case (?employee) { employee.role == "Master" };
        };
      };
    };
  };

  // Helper function to check if caller is authenticated employee
  func isEmployee(caller : Principal) : Bool {
    employeePrincipals.containsKey(caller);
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (employeePrincipals.get(caller)) {
      case (null) { null };
      case (?employeeId) {
        switch (employees.get(employeeId)) {
          case (null) { null };
          case (?employee) {
            ?{
              employeeId = employee.employeeId;
              name = employee.name;
              role = employee.role;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (employeePrincipals.get(user)) {
      case (null) { null };
      case (?employeeId) {
        switch (employees.get(employeeId)) {
          case (null) { null };
          case (?employee) {
            ?{
              employeeId = employee.employeeId;
              name = employee.name;
              role = employee.role;
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    // Profile updates handled through employee management
    Runtime.trap("Use employee management functions to update profile");
  };

  // Employee authentication
  public shared ({ caller }) func authenticateEmployee(employeeId : Text, password : Text) : async Bool {
    switch (employees.get(employeeId)) {
      case (null) { false };
      case (?employee) {
        if (employee.password == password) {
          employeePrincipals.add(caller, employeeId);
          // Assign appropriate role in access control
          if (employee.role == "Master") {
            AccessControl.assignRole(accessControlState, caller, caller, #admin);
          } else {
            AccessControl.assignRole(accessControlState, caller, caller, #user);
          };
          true;
        } else {
          false;
        };
      };
    };
  };

  // Employee Management - Master only
  public shared ({ caller }) func createEmployee(
    employeeId : Text,
    name : Text,
    password : Text,
    role : Text,
  ) : async () {
    if (not isMaster(caller)) {
      Runtime.trap("Unauthorized: Only Master can create employees");
    };
    if (role != "Master" and role != "Employee") {
      Runtime.trap("Invalid role: must be 'Master' or 'Employee'");
    };
    if (employees.containsKey(employeeId)) {
      Runtime.trap("Employee with this ID already exists");
    };

    let employee : Employee = {
      employeeId;
      name;
      password;
      role;
    };
    employees.add(employeeId, employee);
  };

  public query ({ caller }) func getAllEmployees() : async [Employee] {
    if (not isMaster(caller)) {
      Runtime.trap("Unauthorized: Only Master can view all employees");
    };
    let employeesList = List.empty<Employee>();
    for ((_, employee) in employees.entries()) {
      employeesList.add(employee);
    };
    employeesList.toArray();
  };

  public shared ({ caller }) func updateEmployee(
    employeeId : Text,
    name : Text,
    password : Text,
    role : Text,
  ) : async () {
    if (not isMaster(caller)) {
      Runtime.trap("Unauthorized: Only Master can update employees");
    };
    if (role != "Master" and role != "Employee") {
      Runtime.trap("Invalid role: must be 'Master' or 'Employee'");
    };
    if (not employees.containsKey(employeeId)) {
      Runtime.trap("Employee not found");
    };

    let updatedEmployee : Employee = {
      employeeId;
      name;
      password;
      role;
    };
    employees.add(employeeId, updatedEmployee);
  };

  public shared ({ caller }) func deleteEmployee(employeeId : Text) : async () {
    if (not isMaster(caller)) {
      Runtime.trap("Unauthorized: Only Master can delete employees");
    };
    if (employeeId == "SidneiCosta00") {
      Runtime.trap("Cannot delete the master employee");
    };
    if (not employees.containsKey(employeeId)) {
      Runtime.trap("Employee not found");
    };
    employees.remove(employeeId);
  };

  // Client Record Management
  public shared ({ caller }) func createClientRecord(
    idLuid : Text,
    nome : Text,
    senhaCliente : Text,
    ipVps : Text,
    userVps : Text,
    senhaVps : Text,
    plano : Text,
  ) : async () {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can create client records");
    };
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
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can update client records");
    };

    switch (clientRecords.get(idLuid)) {
      case (null) {
        Runtime.trap("Client record not found");
      };
      case (?existingRecord) {
        // Check if senhaCliente is being changed - Master only
        if (existingRecord.senhaCliente != senhaCliente and not isMaster(caller)) {
          Runtime.trap("Unauthorized: Only Master can edit client credentials");
        };

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
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can view client records");
    };
    switch (clientRecords.get(idLuid)) {
      case (null) { Runtime.trap("Client record not found") };
      case (?record) { record };
    };
  };

  public query ({ caller }) func getAllClientRecords() : async [ClientRecord] {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can view client records");
    };
    let recordsList = List.empty<ClientRecord>();
    for ((_, record) in clientRecords.entries()) {
      recordsList.add(record);
    };
    recordsList.toArray();
  };

  public shared ({ caller }) func deleteClientRecord(idLuid : Text) : async () {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can delete client records");
    };
    if (not clientRecords.containsKey(idLuid)) {
      Runtime.trap("Client record does not exist");
    };
    clientRecords.remove(idLuid);
  };

  // Global Announcements
  public shared ({ caller }) func setGlobalAnnouncement(announcement : Text) : async () {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can set announcements");
    };
    globalAnnouncement := announcement;
  };

  public shared ({ caller }) func clearGlobalAnnouncement() : async () {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can clear announcements");
    };
    globalAnnouncement := "";
  };

  public query ({ caller }) func getGlobalAnnouncement() : async Text {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can view announcements");
    };
    globalAnnouncement;
  };

  // Network Monitoring
  public shared ({ caller }) func updateNetworkMonitoringStatus(status : Text) : async () {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can update network status");
    };
    if (status != "normal" and status != "offline") {
      Runtime.trap("Invalid network status");
    };
    networkMonitoringStatus := status;
  };

  public query ({ caller }) func getNetworkMonitoringStatus() : async Text {
    if (not isEmployee(caller)) {
      Runtime.trap("Unauthorized: Only authenticated employees can view network status");
    };
    networkMonitoringStatus;
  };
};
