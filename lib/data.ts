// Static quiz data: Indian states/UTs and Americas countries with capitals

export type RegionType = 'state' | 'union_territory' | 'north_america' | 'south_america';

export interface Place {
  id: string;
  name: string;
  capital: string;
  type: RegionType;
}

export const INDIA_DATA: Place[] = [
  // Indian States
  { id: 'in-ap', name: 'Andhra Pradesh', capital: 'Amaravati', type: 'state' },
  { id: 'in-ar', name: 'Arunachal Pradesh', capital: 'Itanagar', type: 'state' },
  { id: 'in-as', name: 'Assam', capital: 'Dispur', type: 'state' },
  { id: 'in-br', name: 'Bihar', capital: 'Patna', type: 'state' },
  { id: 'in-cg', name: 'Chhattisgarh', capital: 'Raipur', type: 'state' },
  { id: 'in-ga', name: 'Goa', capital: 'Panaji', type: 'state' },
  { id: 'in-gj', name: 'Gujarat', capital: 'Gandhinagar', type: 'state' },
  { id: 'in-hr', name: 'Haryana', capital: 'Chandigarh', type: 'state' },
  { id: 'in-hp', name: 'Himachal Pradesh', capital: 'Shimla', type: 'state' },
  { id: 'in-jh', name: 'Jharkhand', capital: 'Ranchi', type: 'state' },
  { id: 'in-ka', name: 'Karnataka', capital: 'Bengaluru', type: 'state' },
  { id: 'in-kl', name: 'Kerala', capital: 'Thiruvananthapuram', type: 'state' },
  { id: 'in-mp', name: 'Madhya Pradesh', capital: 'Bhopal', type: 'state' },
  { id: 'in-mh', name: 'Maharashtra', capital: 'Mumbai', type: 'state' },
  { id: 'in-mn', name: 'Manipur', capital: 'Imphal', type: 'state' },
  { id: 'in-ml', name: 'Meghalaya', capital: 'Shillong', type: 'state' },
  { id: 'in-mz', name: 'Mizoram', capital: 'Aizawl', type: 'state' },
  { id: 'in-nl', name: 'Nagaland', capital: 'Kohima', type: 'state' },
  { id: 'in-od', name: 'Odisha', capital: 'Bhubaneswar', type: 'state' },
  { id: 'in-pb', name: 'Punjab', capital: 'Chandigarh', type: 'state' },
  { id: 'in-rj', name: 'Rajasthan', capital: 'Jaipur', type: 'state' },
  { id: 'in-sk', name: 'Sikkim', capital: 'Gangtok', type: 'state' },
  { id: 'in-tn', name: 'Tamil Nadu', capital: 'Chennai', type: 'state' },
  { id: 'in-tg', name: 'Telangana', capital: 'Hyderabad', type: 'state' },
  { id: 'in-tr', name: 'Tripura', capital: 'Agartala', type: 'state' },
  { id: 'in-up', name: 'Uttar Pradesh', capital: 'Lucknow', type: 'state' },
  { id: 'in-uk', name: 'Uttarakhand', capital: 'Dehradun', type: 'state' },
  { id: 'in-wb', name: 'West Bengal', capital: 'Kolkata', type: 'state' },
  // Union Territories
  { id: 'in-an', name: 'Andaman and Nicobar Islands', capital: 'Port Blair', type: 'union_territory' },
  { id: 'in-ch', name: 'Chandigarh', capital: 'Chandigarh', type: 'union_territory' },
  { id: 'in-dd', name: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', type: 'union_territory' },
  { id: 'in-dl', name: 'Delhi', capital: 'New Delhi', type: 'union_territory' },
  { id: 'in-jk', name: 'Jammu and Kashmir', capital: 'Srinagar', type: 'union_territory' },
  { id: 'in-la', name: 'Ladakh', capital: 'Leh', type: 'union_territory' },
  { id: 'in-ld', name: 'Lakshadweep', capital: 'Kavaratti', type: 'union_territory' },
  { id: 'in-py', name: 'Puducherry', capital: 'Puducherry', type: 'union_territory' },
];

export const AMERICAS_DATA: Place[] = [
  // North America
  { id: 'na-ag', name: 'Antigua and Barbuda', capital: "Saint John's", type: 'north_america' },
  { id: 'na-bs', name: 'Bahamas', capital: 'Nassau', type: 'north_america' },
  { id: 'na-bb', name: 'Barbados', capital: 'Bridgetown', type: 'north_america' },
  { id: 'na-bz', name: 'Belize', capital: 'Belmopan', type: 'north_america' },
  { id: 'na-ca', name: 'Canada', capital: 'Ottawa', type: 'north_america' },
  { id: 'na-cr', name: 'Costa Rica', capital: 'San José', type: 'north_america' },
  { id: 'na-cu', name: 'Cuba', capital: 'Havana', type: 'north_america' },
  { id: 'na-dm', name: 'Dominica', capital: 'Roseau', type: 'north_america' },
  { id: 'na-do', name: 'Dominican Republic', capital: 'Santo Domingo', type: 'north_america' },
  { id: 'na-sv', name: 'El Salvador', capital: 'San Salvador', type: 'north_america' },
  { id: 'na-gd', name: 'Grenada', capital: "Saint George's", type: 'north_america' },
  { id: 'na-gt', name: 'Guatemala', capital: 'Guatemala City', type: 'north_america' },
  { id: 'na-ht', name: 'Haiti', capital: 'Port-au-Prince', type: 'north_america' },
  { id: 'na-hn', name: 'Honduras', capital: 'Tegucigalpa', type: 'north_america' },
  { id: 'na-jm', name: 'Jamaica', capital: 'Kingston', type: 'north_america' },
  { id: 'na-mx', name: 'Mexico', capital: 'Mexico City', type: 'north_america' },
  { id: 'na-ni', name: 'Nicaragua', capital: 'Managua', type: 'north_america' },
  { id: 'na-pa', name: 'Panama', capital: 'Panama City', type: 'north_america' },
  { id: 'na-kn', name: 'Saint Kitts and Nevis', capital: 'Basseterre', type: 'north_america' },
  { id: 'na-lc', name: 'Saint Lucia', capital: 'Castries', type: 'north_america' },
  { id: 'na-vc', name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', type: 'north_america' },
  { id: 'na-tt', name: 'Trinidad and Tobago', capital: 'Port of Spain', type: 'north_america' },
  { id: 'na-us', name: 'United States', capital: 'Washington, D.C.', type: 'north_america' },
  // South America
  { id: 'sa-ar', name: 'Argentina', capital: 'Buenos Aires', type: 'south_america' },
  { id: 'sa-bo', name: 'Bolivia', capital: 'Sucre', type: 'south_america' },
  { id: 'sa-br', name: 'Brazil', capital: 'Brasília', type: 'south_america' },
  { id: 'sa-cl', name: 'Chile', capital: 'Santiago', type: 'south_america' },
  { id: 'sa-co', name: 'Colombia', capital: 'Bogotá', type: 'south_america' },
  { id: 'sa-ec', name: 'Ecuador', capital: 'Quito', type: 'south_america' },
  { id: 'sa-gy', name: 'Guyana', capital: 'Georgetown', type: 'south_america' },
  { id: 'sa-py', name: 'Paraguay', capital: 'Asunción', type: 'south_america' },
  { id: 'sa-pe', name: 'Peru', capital: 'Lima', type: 'south_america' },
  { id: 'sa-sr', name: 'Suriname', capital: 'Paramaribo', type: 'south_america' },
  { id: 'sa-uy', name: 'Uruguay', capital: 'Montevideo', type: 'south_america' },
  { id: 'sa-ve', name: 'Venezuela', capital: 'Caracas', type: 'south_america' },
];

export const ALL_DATA: Place[] = [...INDIA_DATA, ...AMERICAS_DATA];

export function getTypeLabel(type: RegionType): string {
  switch (type) {
    case 'state': return 'Indian State';
    case 'union_territory': return 'Union Territory of India';
    case 'north_america': return 'North America';
    case 'south_america': return 'South America';
  }
}

export function getTypeShortLabel(type: RegionType): string {
  switch (type) {
    case 'state': return 'State';
    case 'union_territory': return 'Union Territory';
    case 'north_america': return 'North America';
    case 'south_america': return 'South America';
  }
}
