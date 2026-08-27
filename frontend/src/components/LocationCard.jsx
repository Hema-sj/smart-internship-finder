import { MapPin } from 'lucide-react';
import { LOCATION_GRADIENTS } from '../data/locations';

// City landmark images - Famous iconic places
const CITY_IMAGES = {
  // Major Tech Hubs
  'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Marina Beach
  'Bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop&q=85', // Bangalore Palace
  'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop&q=85', // Bangalore Palace
  'Hyderabad': 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&h=400&fit=crop&q=85', // Charminar
  'Pune': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&h=400&fit=crop&q=85', // Shaniwar Wada
  
  // Metro Cities  
  'Mumbai': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&h=400&fit=crop&q=85', // Gateway of India
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // India Gate
  'New Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // India Gate
  'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&h=400&fit=crop&q=85', // Victoria Memorial
  'Ahmedabad': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Sabarmati Riverfront
  'Gurugram': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=85', // Cyber City
  'Noida': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=85', // Modern IT hub
  'Dehradun': 'https://images.unsplash.com/photo-1626445041116-00c05a862074?w=600&h=400&fit=crop&q=85', // Mountain city
  'Bhubaneswar': 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&h=400&fit=crop&q=85', // Lingaraja Temple
  'Guwahati': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop&q=85', // Brahmaputra River
  'Gandhinagar': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Akshardham Temple
  'Thiruvananthapuram': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop&q=85', // Padmanabhaswamy Temple
  'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop&q=85', // Hawa Mahal
  'Ludhiana': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Punjab
  'Jodhpur': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop&q=85', // Mehrangarh Fort
  
  // Tier 2 Cities
  'Coimbatore': 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&h=400&fit=crop&q=85', // Marudhamalai Temple
  'Kochi': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop&q=85', // Chinese Fishing Nets
  'Cochin': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop&q=85', // Chinese Fishing Nets
  'Chandigarh': 'https://images.unsplash.com/photo-1619542584441-8002135c4cdb?w=600&h=400&fit=crop&q=85', // Rock Garden
  'Lucknow': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Bara Imambara
  'Bhopal': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop&q=85', // Upper Lake
  'Indore': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Rajwada Palace
  'Nagpur': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // Deekshabhoomi
  'Surat': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Diamond City
  'Rajkot': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Watson Museum
  'Vadodara': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Laxmi Vilas Palace
  'Baroda': 'https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=600&h=400&fit=crop&q=85', // Laxmi Vilas Palace
  
  // Other Cities
  'Trivandrum': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop&q=85', // Padmanabhaswamy Temple
  'Vizag': 'https://images.unsplash.com/photo-1581025231614-84352b533202?w=600&h=400&fit=crop&q=85', // RK Beach
  'Visakhapatnam': 'https://images.unsplash.com/photo-1581025231614-84352b533202?w=600&h=400&fit=crop&q=85', // Beach
  'Mysore': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=85', // Mysore Palace
  'Mysuru': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop&q=85', // Mysore Palace
  
  // North India
  'Greater Noida': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // NCR
  'Ghaziabad': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // NCR
  'Faridabad': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop&q=85', // NCR
  
  // East India
  'Patna': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Ganga Ghat
  'Ranchi': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Tagore Hill
  
  // South India
  'Madurai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Meenakshi Temple
  'Trichy': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Rock Fort
  'Tiruchirappalli': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Rock Fort
  'Salem': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Yercaud Hills
  'Vellore': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Vellore Fort
  'Tirupati': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop&q=85', // Tirumala Temple
  'Mangalore': 'https://images.unsplash.com/photo-1581025231614-84352b533202?w=600&h=400&fit=crop&q=85', // Beach
  'Mangaluru': 'https://images.unsplash.com/photo-1581025231614-84352b533202?w=600&h=400&fit=crop&q=85', // Coastal
  'Vijayawada': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Prakasam Barrage
  'Warangal': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Warangal Fort
  'Guntur': 'https://images.unsplash.com/photo-1626261189496-b5be084d8c00?w=600&h=400&fit=crop&q=85', // Amaravati
  'Kakinada': 'https://images.unsplash.com/photo-1581025231614-84352b533202?w=600&h=400&fit=crop&q=85', // Hope Island
  
  // Work Types
  'Remote': 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=400&fit=crop&q=85', // Remote Work
  'Work From Home': 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&h=400&fit=crop&q=85', // WFH
  'Hybrid': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=85', // Office + Home
  'On-site': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=85', // Office
  'Onsite': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=85', // Office
  
  // International
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop&q=85', // Marina Bay
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop&q=85', // Burj Khalifa
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop&q=85', // Big Ben
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop&q=85', // NYC
  'San Francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop&q=85', // Golden Gate
  'Toronto': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=400&fit=crop&q=85', // CN Tower
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop&q=85', // Opera House
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop&q=85', // Brandenburg Gate
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop&q=85', // Eiffel Tower
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop&q=85', // Canals
};

export default function LocationCard({
  location,
  total = 0,
  paid = 0,
  unpaid = 0,
  onClick,
  selected = false,
}) {
  const gradient = LOCATION_GRADIENTS[location] || 'from-slate-600 to-slate-500';
  const internshipLabel = `${Number(total).toLocaleString('en-IN')} Internship${total === 1 ? '' : 's'}`;
  const cityImage = CITY_IMAGES[location];

  return (
    <button
      type="button"
      onClick={() => onClick?.(location)}
      aria-label={`Browse internships in ${location}`}
      aria-pressed={selected}
      className={`group w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        selected ? 'ring-2 ring-emerald-500' : 'ring-slate-200'
      }`}
    >
      {/* City Image Header */}
      <div className="relative h-32 overflow-hidden">
        {cityImage ? (
          <img 
            src={cityImage} 
            alt={location}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 px-4 py-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <MapPin size={18} className="text-white" />
            </div>
            <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white">
              {internshipLabel}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white sm:text-2xl drop-shadow-lg">{location}</h3>
            <p className="mt-0.5 text-sm font-semibold text-white/90 drop-shadow">{internshipLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 px-4 py-3 sm:px-5">
        <div>
          <p className="text-lg font-extrabold text-emerald-700">{Number(paid).toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500">Paid: {Number(paid).toLocaleString('en-IN')}</p>
        </div>
        <div className="pl-4">
          <p className="text-lg font-extrabold text-amber-600">{Number(unpaid).toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-slate-500">Unpaid: {Number(unpaid).toLocaleString('en-IN')}</p>
        </div>
      </div>
    </button>
  );
}
