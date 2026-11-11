export const US_STATES: ReadonlyArray<[code: string, name: string]> = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'],
  ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'],
  ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

export const stateName = (code: string) => US_STATES.find((s) => s[0] === code)?.[1] ?? code;

export const COUNTRIES: ReadonlyArray<[code: string, name: string, dial: string]> = [
  ['US', 'United States', '+1'], ['PR', 'Puerto Rico', '+1'], ['CA', 'Canada', '+1'], ['MX', 'Mexico', '+52'],
  ['DO', 'Dominican Republic', '+1'], ['CO', 'Colombia', '+57'], ['VE', 'Venezuela', '+58'],
  ['GT', 'Guatemala', '+502'], ['SV', 'El Salvador', '+503'], ['HN', 'Honduras', '+504'], ['CU', 'Cuba', '+53'],
  ['HT', 'Haiti', '+509'], ['BR', 'Brazil', '+55'], ['PH', 'Philippines', '+63'], ['IN', 'India', '+91'],
  ['GB', 'United Kingdom', '+44'],
];
