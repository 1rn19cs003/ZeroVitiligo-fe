import { TESTIMONIALS } from '@/lib/constants';

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.bgColor} text-white p-8 rounded-lg relative`}
            >
              <div className="text-5xl mb-4 opacity-50">``</div>
              <p className="text-lg leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}