/**
 *
 * @param {org.autoinsurancechain.setup} setup - Setupinstance
 * @transaction
 */
async function setup(setup) {  // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';
    
    const insurance = factory.newResource(NS, 'Insurance', '00001');
    insurance.idInsurance = '00001';
    insurance.name = 'InsuranceBusiness';    
    const insuranceRegistry = await getParticipantRegistry(NS + '.Insurance');
    await insuranceRegistry.addAll([insurance]);

    const garage = factory.newResource(NS, 'Garage', '00001');
    garage.idGarage = '00001';
    garage.commercialname = 'Taller Pepito';
    garage.city = 'Madrid';
    garage.postcode = '28009';        
    const garageRegistry = await getParticipantRegistry(NS + '.Garage');
    await garageRegistry.addAll([garage]);

    const regulator = factory.newResource(NS, 'Regulator','00001');
    regulator.idRegulator = '00001';
    regulator.name = 'REGULATOR';    
    const regulatorRegistry = await getParticipantRegistry(NS + '.Regulator');
    await regulatorRegistry.addAll([regulator]);    
}

/**
 *
 * @param {org.autoinsurancechain.InsuredRegister} InsuredRegister - InsuredRegisterinstance
 * @transaction
 */
async function insuredregistry(InsuredRegister){
        // Get the vehicle asset registry.
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';
    const aseguradora = 'INSURANCEBUSINESS';
        
    var insured = factory.newResource(NS, 'Insured', InsuredRegister.idinsurance)
    insured.idInsured = InsuredRegister.idinsurance;
    insured.owner = factory.newRelationship(NS, 'Insurance', aseguradora);
    const insuredRegistry = await getAssetRegistry(NS + '.Insured');
    await insuredRegistry.add(insured)  
   
}

/**
 *
 * @param {org.autoinsurancechain.VehicleRegister} VehicleRegister - InsuredRegisterinstance
 * @transaction
 */
async function vehicleregister(VehicleRegister){
        // Get the vehicle asset registry.
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';
    //const aseguradora = 'INSURANCEBUSINESS';
    //const insurance = 'Insured_' + VehicleRegister.idInsurance;
    
    //resource:org.autoinsurancechain.Insured#6055
    
        
    var vehicle = factory.newResource(NS, 'Vehicle', VehicleRegister.idVehicle);
    vehicle.idVehicle = VehicleRegister.idVehicle;
    vehicle.color = VehicleRegister.color;
    vehicle.horsepower = VehicleRegister.horsepower;
    vehicle.model = VehicleRegister.model;
    vehicle.brand = VehicleRegister.brand;
    vehicle.year = VehicleRegister.year;
    vehicle.carlicense = VehicleRegister.carlicense;
    vehicle.insured = factory.newRelationship(NS, 'Insured', VehicleRegister.insured.idInsurance);  	 	
    vehicle.insured = VehicleRegister.insured;  	 	 
    const vehicleRegistry = await getAssetRegistry(NS + '.Vehicle');
    await vehicleRegistry.add(vehicle)     
}

/**
 *
 * @param {org.autoinsurancechain.PolicyRegister} PolicyRegister - PolicyRegisterinstance
 * @transaction
 */
async function policyregister(PolicyRegister){
        // Get the vehicle asset registry.
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';
            
    var insurancepolicy = factory.newResource(NS, 'InsurancePolicy', PolicyRegister.idInsurancePolicy);  
    
    insurancepolicy.idInsurancePolicy = PolicyRegister.idInsurancePolicy;    
    insurancepolicy.statepolicy = 'StateInactive';
    insurancepolicy.insuranceVehicle = factory.newRelationship(NS, 'Vehicle',  PolicyRegister.insuranceVehicle.idVehicle);
    insurancepolicy.insured = factory.newRelationship(NS, 'Insured', PolicyRegister.insured.idInsured);    
    const policyRegistry = await getAssetRegistry(NS + '.InsurancePolicy');
    await policyRegistry.add(insurancepolicy)
  
}


/**
 *
 * @param {org.autoinsurancechain.SignUpDevicePolicy} SignUpDevicePolicy - SignUpDevicePolicyinstance
 * @transaction
 */

async function signupdevicepolicy(SignUpDevicePolicy){
        
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';  
      
    const assetRegistry1 = await getAssetRegistry(NS + '.Device');
    e1=await assetRegistry1.exists(SignUpDevicePolicy.idDevice);
    
  	if(e1==false) {  // 
      //registrar los 3 devices
      console.log('registro de device')
      
      const device = factory.newResource(NS, 'Device', SignUpDevicePolicy.idDevice)
      device.timestamp = Date.now().toString();      
      
      device.ids=SignUpDevicePolicy.ids      
      
      const deviceRegistry = await getAssetRegistry(NS + '.Device');
      await deviceRegistry.add(device);
           
      SignUpDevicePolicy.insurancepolicy.statepolicy = 'StateActive';
      SignUpDevicePolicy.insurancepolicy.devicevehicle = device;
      
      const br = await getAssetRegistry(NS + '.InsurancePolicy');
      await br.update(SignUpDevicePolicy.insurancepolicy);
           
    }
    else {
      console.log('Existen elementoss');
    }
}


/**
*
* @param {org.autoinsurancechain.DeviceSendInfo} DeviceSendInfo - DeviceSendInfo
* @transaction
*/
async function DeviceSendInfo(DeviceSendInfo){
	const factory = getFactory();
    const NS = 'org.autoinsurancechain';    
    if (DeviceSendInfo.device.statedevice != 'StateActive'){
		throw new Error('Device does not work');        
    }
  	DeviceSendInfo.device.timestamp=DeviceSendInfo.Timestamp;
    DeviceSendInfo.device.linearacceleration=DeviceSendInfo.linearacceleration;
    DeviceSendInfo.device.lateralacceleration=DeviceSendInfo.lateralacceleration;
    DeviceSendInfo.device.roadtype=DeviceSendInfo.roadtype;
  	const ds = await getAssetRegistry(NS+'.Device');  
  	await ds.update(DeviceSendInfo.device);
}


/**
*
* @param {org.autoinsurancechain.GarageSendInfo} GarageSendInfo - GarageSendInfo
* @transaction
*/
async function GarageSendInfo(GarageSendInfo){  	
	const factory = getFactory();
    const NS = 'org.autoinsurancechain';
    
  	GarageSendInfo.insurancepolicy.insuranceVehicle.statevehicle=GarageSendInfo.statevehicle;
    const ip = await getAssetRegistry(NS+'.Vehicle');  
  	await ip.update(GarageSendInfo.insurancepolicy.insuranceVehicle);
       
 }

/**
*
* @param {org.autoinsurancechain.UpdateDevicePolicy} UpdateDevicePolicy - UpdateDevicePolicyinsance
* @transaction
*/
async function UpdateDevicePolicy(UpdateDevicePolicy){
     // Get the vehicle asset registry.
  const factory = getFactory();
  const NS = 'org.autoinsurancechain';
        
  console.log("Actualizando dispositivo en poliza")
  UpdateDevicePolicy.insurancepolicy.devicevehicle.ids[0]=UpdateDevicePolicy.ids[0];
  UpdateDevicePolicy.insurancepolicy.devicevehicle.ids[1]=UpdateDevicePolicy.ids[1];
  UpdateDevicePolicy.insurancepolicy.devicevehicle.ids[2]=UpdateDevicePolicy.ids[2];
  
  const dsdevice = await getAssetRegistry(NS+'.Device');
  await dsdevice.update(UpdateDevicePolicy.insurancepolicy.devicevehicle)
  
  const ds = await getAssetRegistry(NS+'.InsurancePolicy');  
  await ds.update(UpdateDevicePolicy.insurancepolicy);
  
}

/**
*
* @param {org.autoinsurancechain.AddGarage} AddGarage - AddGarageinstance
* @transaction
*/
async function AddGarage(AddGarage){
    const factory = getFactory();
    const NS = 'org.autoinsurancechain';
    const garage = factory.newResource(NS, 'Garage', AddGarage.idGarage);
    garage.idGarage = AddGarage.idGarage;
    garage.commercialname = AddGarage.commercialname;
    garage.city = AddGarage.city;
    garage.postcode = AddGarage.postcode;        
    const garageRegistry = await getParticipantRegistry(NS + '.Garage');
    await garageRegistry.addAll([garage]);
}