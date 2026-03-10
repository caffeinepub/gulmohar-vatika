import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  // Data type for plant category
  type PlantCategory = {
    #foliage;
    #flowering;
    #fruiting;
    #succulent;
  };

  // Plant record
  type Plant = {
    name : Text;
    category : PlantCategory;
  };

  // Initialize plant collection as persistent storage
  let plantData = Map.empty<Text, Plant>();

  // Store initial data on deployment
  public shared ({ caller }) func initializePlants() : async () {
    let initialPlants : [(Text, Plant)] = [
      ("Rose", { name = "Rose"; category = #flowering }),
      ("Aloe Vera", { name = "Aloe Vera"; category = #succulent }),
      ("Bamboo", { name = "Bamboo"; category = #foliage }),
    ];
    for ((name, plant) in initialPlants.values()) {
      plantData.add(name, plant);
    };
  };

  // Query all plants
  public query ({ caller }) func getPlants() : async [Plant] {
    plantData.values().toArray();
  };
};
