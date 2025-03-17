
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, Quote } from 'lucide-react';

interface CoupleInfo {
  name1: string;
  name2: string;
  location: string;
  marriageDate: string;
}

interface Story {
  id: number;
  title: string;
  image: string;
  couple: CoupleInfo;
  quote: string;
  story: string;
}

const SuccessStoryList = () => {
  const stories: Story[] = [
    {
      id: 1,
      title: "Anusha & Praveen: Found Love in Familiar Places",
      image: "https://images.unsplash.com/photo-1522844990619-4951c40f7eda?auto=format&fit=crop&q=80",
      couple: {
        name1: "Anusha Perera",
        name2: "Praveen Fernando",
        location: "Colombo, Sri Lanka",
        marriageDate: "June 15, 2023"
      },
      quote: "We lived just 10 kilometers apart for years but never crossed paths until Vivah matched us. Our shared values and dreams made it clear we were meant for each other.",
      story: "Anusha had been on Vivah for just two weeks when she matched with Praveen. Despite living in the same city, their paths had never crossed. Their first date lasted five hours as they discovered their shared love for traditional Sri Lankan cuisine and travel. Six months later, Praveen proposed during a weekend trip to Kandy.",
    },
    {
      id: 2,
      title: "Nithya & Raj: A Cross-Cultural Success Story",
      image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80",
      couple: {
        name1: "Nithya Krishnan",
        name2: "Raj Patel",
        location: "Jaffna & Negombo, Sri Lanka",
        marriageDate: "November 7, 2022"
      },
      quote: "We come from different cultural backgrounds but Vivah helped us find common ground. Our families were initially hesitant but now they're one big happy family.",
      story: "Nithya from Jaffna and Raj from Negombo matched on Vivah after both had been using the platform for several months. Despite their different cultural backgrounds, they found they shared the same values and vision for their future. After three months of messaging and video calls, they met in person and immediately felt a connection that transcended their cultural differences.",
    },
    {
      id: 3,
      title: "Dilshan & Amaya: Second Chances at Love",
      image: "https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?auto=format&fit=crop&q=80",
      couple: {
        name1: "Dilshan Jayawardena",
        name2: "Amaya Ranasinghe",
        location: "Galle, Sri Lanka",
        marriageDate: "March 21, 2023"
      },
      quote: "As divorcees in our 40s, we both thought finding love again would be difficult. Vivah's matching algorithm brought us together based on our life experiences and future goals.",
      story: "Both Dilshan and Amaya had previously been married and were hesitant about finding love again. They joined Vivah after recommendations from friends and were impressed by the platform's focus on compatibility beyond just appearances. After matching, they spent months getting to know each other before meeting in person. Their shared experiences and understanding of life's complexities helped them form a deep bond.",
    },
    {
      id: 4,
      title: "Lakmal & Tharushi: From Premium Members to Lifelong Partners",
      image: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80",
      couple: {
        name1: "Lakmal Bandara",
        name2: "Tharushi Silva",
        location: "Kandy, Sri Lanka",
        marriageDate: "September 3, 2022"
      },
      quote: "Upgrading to premium was the best decision we made. The advanced filters helped us find each other, and the unlimited messaging let us build a real connection before meeting.",
      story: "Lakmal had been using Vivah for a few weeks without much luck when he decided to upgrade to premium. Within days, he matched with Tharushi, who had also recently upgraded. They attribute their success to the premium features that allowed them to be more specific about what they were looking for in a partner. After just two months of conversation, they knew they had found their match.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Their Stories</h2>
        
        <div className="space-y-20">
          {stories.map((story, index) => (
            <motion.article 
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-matrimony-100 dark:border-gray-700 pb-16 last:border-b-0"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10`}>
                <div className="md:w-2/5">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="md:w-3/5">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{story.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-matrimony-600 dark:text-matrimony-300">
                      <Heart className="h-4 w-4 mr-2" />
                      <span>{story.couple.name1} & {story.couple.name2}</span>
                    </div>
                    <div className="flex items-center text-matrimony-600 dark:text-matrimony-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{story.couple.location}</span>
                    </div>
                    <div className="flex items-center text-matrimony-600 dark:text-matrimony-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Married on {story.couple.marriageDate}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6 bg-matrimony-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="flex">
                      <Quote className="h-8 w-8 text-matrimony-300 mr-3 flex-shrink-0" />
                      <p className="italic text-lg">{story.quote}</p>
                    </div>
                  </div>
                  
                  <p className="text-matrimony-600 dark:text-matrimony-300">{story.story}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-matrimony-600 dark:text-matrimony-300 mb-8">
            These are just a few of the thousands of success stories from our platform. 
            Your love story could be next!
          </p>
          <Button size="lg" className="rounded-full bg-matrimony-600 hover:bg-matrimony-700" asChild>
            <Link to="/register">Start Your Journey Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoryList;
