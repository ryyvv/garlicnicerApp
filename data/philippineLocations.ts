export interface PhilippineLocation {
  city: string;
  province: string;
  region: string;
  regionCode: string;
}

export const philippineLocations: PhilippineLocation[] = [
  // NCR
  { city: "Manila", province: "Metro Manila", region: "National Capital Region", regionCode: "NCR" },
  { city: "Quezon City", province: "Metro Manila", region: "National Capital Region", regionCode: "NCR" },
  { city: "Makati", province: "Metro Manila", region: "National Capital Region", regionCode: "NCR" },
  { city: "Pasig", province: "Metro Manila", region: "National Capital Region", regionCode: "NCR" },
  { city: "Taguig", province: "Metro Manila", region: "National Capital Region", regionCode: "NCR" },
  
  // Region I - Ilocos Region
  { city: "Laoag", province: "Ilocos Norte", region: "Ilocos Region", regionCode: "Region I", latitude: 18.1967, longitude: 120.5934 },
  { city: "Vigan", province: "Ilocos Sur", region: "Ilocos Region", regionCode: "Region I", latitude: 17.5748, longitude: 120.3867 },
  { city: "Dagupan", province: "Pangasinan", region: "Ilocos Region", regionCode: "Region I", latitude: 16.0433, longitude: 120.3334 },
  { city: "San Fernando", province: "La Union", region: "Ilocos Region", regionCode: "Region I", latitude: 16.6159, longitude: 120.3209 },
  
  // Region II - Cagayan Valley
  { city: "Tuguegarao", province: "Cagayan", region: "Cagayan Valley", regionCode: "Region II" },
  { city: "Ilagan", province: "Isabela", region: "Cagayan Valley", regionCode: "Region II" },
  { city: "Bayombong", province: "Nueva Vizcaya", region: "Cagayan Valley", regionCode: "Region II" },
  
  // Region III - Central Luzon
  { city: "San Fernando", province: "Pampanga", region: "Central Luzon", regionCode: "Region III" },
  { city: "Malolos", province: "Bulacan", region: "Central Luzon", regionCode: "Region III" },
  { city: "Tarlac City", province: "Tarlac", region: "Central Luzon", regionCode: "Region III" },
  { city: "Cabanatuan", province: "Nueva Ecija", region: "Central Luzon", regionCode: "Region III" },
  { city: "Balanga", province: "Bataan", region: "Central Luzon", regionCode: "Region III" },
  
  // Region IV-A - CALABARZON
  { city: "Calamba", province: "Laguna", region: "CALABARZON", regionCode: "Region IV-A" },
  { city: "Antipolo", province: "Rizal", region: "CALABARZON", regionCode: "Region IV-A" },
  { city: "Batangas City", province: "Batangas", region: "CALABARZON", regionCode: "Region IV-A" },
  { city: "Lucena", province: "Quezon", region: "CALABARZON", regionCode: "Region IV-A" },
  { city: "Imus", province: "Cavite", region: "CALABARZON", regionCode: "Region IV-A" },
  
  // Region V - Bicol Region
  { city: "Legazpi", province: "Albay", region: "Bicol Region", regionCode: "Region V" },
  { city: "Naga", province: "Camarines Sur", region: "Bicol Region", regionCode: "Region V" },
  { city: "Iriga", province: "Camarines Sur", region: "Bicol Region", regionCode: "Region V" },
  { city: "Masbate City", province: "Masbate", region: "Bicol Region", regionCode: "Region V" },
  
  // Region VI - Western Visayas
  { city: "Iloilo City", province: "Iloilo", region: "Western Visayas", regionCode: "Region VI" },
  { city: "Bacolod", province: "Negros Occidental", region: "Western Visayas", regionCode: "Region VI" },
  { city: "Roxas", province: "Capiz", region: "Western Visayas", regionCode: "Region VI" },
  { city: "Kalibo", province: "Aklan", region: "Western Visayas", regionCode: "Region VI" },
  
  // Region VII - Central Visayas
  { city: "Cebu City", province: "Cebu", region: "Central Visayas", regionCode: "Region VII" },
  { city: "Mandaue", province: "Cebu", region: "Central Visayas", regionCode: "Region VII" },
  { city: "Tagbilaran", province: "Bohol", region: "Central Visayas", regionCode: "Region VII" },
  { city: "Dumaguete", province: "Negros Oriental", region: "Central Visayas", regionCode: "Region VII" },
  
  // Region VIII - Eastern Visayas
  { city: "Tacloban", province: "Leyte", region: "Eastern Visayas", regionCode: "Region VIII" },
  { city: "Ormoc", province: "Leyte", region: "Eastern Visayas", regionCode: "Region VIII" },
  { city: "Calbayog", province: "Samar", region: "Eastern Visayas", regionCode: "Region VIII" },
  
  // Region IX - Zamboanga Peninsula
  { city: "Zamboanga City", province: "Zamboanga del Sur", region: "Zamboanga Peninsula", regionCode: "Region IX" },
  { city: "Pagadian", province: "Zamboanga del Sur", region: "Zamboanga Peninsula", regionCode: "Region IX" },
  { city: "Dipolog", province: "Zamboanga del Norte", region: "Zamboanga Peninsula", regionCode: "Region IX" },
  
  // Region X - Northern Mindanao
  { city: "Cagayan de Oro", province: "Misamis Oriental", region: "Northern Mindanao", regionCode: "Region X" },
  { city: "Iligan", province: "Lanao del Norte", region: "Northern Mindanao", regionCode: "Region X" },
  { city: "Butuan", province: "Agusan del Norte", region: "Northern Mindanao", regionCode: "Region X" },
  
  // Region XI - Davao Region
  { city: "Davao City", province: "Davao del Sur", region: "Davao Region", regionCode: "Region XI" },
  { city: "Tagum", province: "Davao del Norte", region: "Davao Region", regionCode: "Region XI" },
  { city: "Panabo", province: "Davao del Norte", region: "Davao Region", regionCode: "Region XI" },
  
  // Region XII - SOCCSKSARGEN
  { city: "General Santos", province: "South Cotabato", region: "SOCCSKSARGEN", regionCode: "Region XII" },
  { city: "Koronadal", province: "South Cotabato", region: "SOCCSKSARGEN", regionCode: "Region XII" },
  { city: "Kidapawan", province: "Cotabato", region: "SOCCSKSARGEN", regionCode: "Region XII" },
];