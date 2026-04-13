import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    label: { text: 'For small projects', color: 'bg-orange-500' },
    title: 'IT staff augmentation',
    description: 'Boost your team, instantly. Scale your development capabilities on-demand with our expert engineers. Whether you need one developer or a full squad, our vetted professionals integrate seamlessly with your existing team to accelerate delivery — with zero overhead.',
    image: '/Images/Model/IT Staff.jpeg', // Replace with actual image path
    route: '/services/it-staff-augmentation'
  },
  {
    label: { text: 'Fit for products', color: 'bg-green-500' },
    title: 'Dedicated teams',
    description: 'Your dream team, delivered. We build dedicated, cross-functional teams tailored to your project needs. From developers and designers to project managers and QA experts — your custom squad works exclusively on your goals, ensuring deep focus and alignment.',
    image: '/Images/Model/Team.jpeg', // Replace with actual image path
    route: '/services/dedicated-teams'
  },
  {
    label: { text: 'For enterprise', color: 'bg-blue-500' },
    title: 'Offshore development center',
    description: 'Global talent. Local results. Set up your own Offshore Development Center with us and unlock access to a pool of highly-skilled developers — without the hassle of infrastructure, compliance, or hiring. We handle the backend, you focus on building great products.',
    image: '/Images/Model/Center.jpeg', // Replace with actual image path
    route: '/services/offshore-development-center'
  }
];

const partners = [
  { name: 'Google Cloud Partner', logo: '/Images/Logo/Cloud.jpeg' },
  { name: 'OVHCloud', logo: '/Images/Logo/OVH.png' },
  { name: 'Microsoft Partner', logo: '/Images/Logo/MicroSoft.png' },
  { name: 'Bechtle', logo: '/Images/Logo/Bechtle AG_Logo_1.png' },
];

export default function EngagementSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 
          className="text-4xl font-bold text-center mb-20 text-gray-900"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Transparent and flexible engagement model
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden flex flex-col h-full"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="800"
            >
              <div className="relative">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={400}
                  height={250}
                  className="w-full h-[200px] object-cover"
                />
                <span 
                  className={`absolute bottom-0 left-0 ${card.label.color} text-white text-xs font-medium px-3 py-1.5 rounded-tr-md`}
                >
                  {card.label.text}
                </span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">{card.description}</p>
                <Link 
                  href={card.route} 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs mt-auto"
                >
                  Learn more
                  <svg className="w-3.5 h-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 
            className="text-3xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Partnerships built on trust
          </h2>
          <p 
            className="text-gray-600 mb-16 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            We collaborate with industry leaders to deliver exceptional solutions and drive innovation forward.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className={`w-40 h-20 relative transition-all flex items-center justify-center ${partner.name === 'OVHCloud' ? 'bg-gray-900 p-3 rounded-lg' : 'p-2'}`}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                data-aos-duration="800"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain p-1"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}