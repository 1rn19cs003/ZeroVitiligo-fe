import Image from 'next/image';

const progressData = [
  {
    id: 1,
    weeks: '6 Weeks & 2+ Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress after 6 weeks',
  },
  {
    id: 2,
    weeks: '8 Weeks & 2+ Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress after 8 weeks',
  },
  {
    id: 3,
    weeks: '12 Weeks & 4+ Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress after 12 weeks',
  },
];

export default function ProgressShowcase() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-12">
          Progress We are Proud Of
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left side - Progress Images */}
          <div className="grid grid-cols-3 gap-4">
            {progressData.map((item) => (
              <div key={item.id} className="relative">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-4 border-black shadow-lg">
                  <Image
                    src={item.imageSrc}
                    alt={item.alt}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center mt-2 font-semibold text-gray-700">
                  {item.weeks}
                </p>
              </div>
            ))}
          </div>

          {/* Right side - Stats and Doctor */}
          <div className="space-y-8">
            <div className="bg-[#1e3a8a] text-white p-8 md:p-12 rounded-lg">
              <div className="text-7xl md:text-8xl font-bold mb-4">94%</div>
              <p className="text-lg text-blue-200">
                Of users report better skin health within 90 days
              </p>
            </div>

            <div className="bg-[#1e3a8a] text-white p-6 rounded-lg flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex-shrink-0">
                <Image
                  src="/images/images.jpg"
                  alt="Dr. Arya Sharma"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">Dr. Arya Sharma</p>
                <p className="text-sm text-blue-200">
                  Trained top dermatologists in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}