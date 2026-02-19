import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldEmployee = {
    employeeId : Text;
    name : Text;
    password : Text;
    role : Text;
  };

  public type NewEmployee = {
    employeeId : Text;
    name : Text;
    password : Text;
    role : Text;
  };

  public type OldActor = {
    employees : Map.Map<Text, OldEmployee>;
    employeePrincipals : Map.Map<Principal, Text>;
    clientRecords : Map.Map<Text, {
      idLuid : Text;
      nome : Text;
      senhaCliente : Text;
      ipVps : Text;
      userVps : Text;
      senhaVps : Text;
      plano : Text;
    }>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
    masterEmployee : OldEmployee; // Old field explicitly dropped
  };

  public type NewActor = {
    employees : Map.Map<Text, NewEmployee>;
    employeePrincipals : Map.Map<Principal, Text>;
    clientRecords : Map.Map<Text, {
      idLuid : Text;
      nome : Text;
      senhaCliente : Text;
      ipVps : Text;
      userVps : Text;
      senhaVps : Text;
      plano : Text;
    }>;
    globalAnnouncement : Text;
    networkMonitoringStatus : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newEmployees = old.employees.map<Text, OldEmployee, NewEmployee>(
      func(employeeId, employee) {
        if (employeeId == "SidneiCosta00") {
          {
            employee with
            password = "Nikebolado@4";
            role = "Master";
          };
        } else { employee };
      }
    );
    {
      employees = newEmployees;
      employeePrincipals = old.employeePrincipals;
      clientRecords = old.clientRecords;
      globalAnnouncement = old.globalAnnouncement;
      networkMonitoringStatus = old.networkMonitoringStatus;
    };
  };
};
