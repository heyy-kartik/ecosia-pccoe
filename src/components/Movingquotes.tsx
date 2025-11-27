import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Smallstar from "@/components/Smallstar";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Donor, Pune",
    rating: 5,
    quote:
      "I donated two bags of clothes. The NGO picked them up, confirmed, and I got a receipt the same week. Simple and trustworthy.",
    avatar: "PS",
  },
  {
    name: "Rajan Mehra",
    role: "Volunteer, Delhi",
    rating: 5,
    quote:
      "We ran a neighbourhood drive — the platform made coordination easier and the NGO reporting helped track impact.",
    avatar: "RM",
  },
  {
    name: "Meera Joshi",
    role: "Teacher, Mumbai",
    rating: 4,
    quote:
      "I recommended this to parents — kids loved donating toys. The team followed up politely and reliably.",
    avatar: "MJ",
  },
  {
    name: "Arun Patel",
    role: "Donor, Ahmedabad",
    rating: 5,
    quote: "Easy to use, quick confirmation and helpful receipts for tax time.",
    avatar: "AP",
  },
  {
    name: "Sneha Rao",
    role: "Volunteer, Bangalore",
    rating: 5,
    quote: "Great platform for running local drives — saved us so much time.",
    avatar: "SR",
  },
  {
    name: "Vikram Singh",
    role: "NGO Volunteer, Lucknow",
    rating: 4,
    quote: "Smooth coordination with donors and clear pickup slots.",
    avatar: "VS",
  },
  {
    name: "Kavita Mehta",
    role: "Teacher, Kolkata",
    rating: 5,
    quote:
      "We used this for school supply drives — parents loved the simplicity.",
    avatar: "KM",
  },
  {
    name: "Rohit Deshmukh",
    role: "Donor, Pune",
    rating: 5,
    quote:
      "Transparent updates and receipts made me trust the platform immediately.",
    avatar: "RD",
  },
  {
    name: "Nisha Gupta",
    role: "Donor, Jaipur",
    rating: 4,
    quote: "Pickup scheduling worked well and the volunteers were punctual.",
    avatar: "NG",
  },
  {
    name: "Sahil Verma",
    role: "Corporate CSR, Gurgaon",
    rating: 5,
    quote:
      "Our CSR drives have become more streamlined; reporting is excellent.",
    avatar: "SV",
  },
  {
    name: "Leena Kapoor",
    role: "Donor, Chandigarh",
    rating: 5,
    quote:
      "I love the local campaigns feature — it's great to see neighborhood drives.",
    avatar: "LK",
  },
  {
    name: "Praveen Nair",
    role: "Volunteer, Kochi",
    rating: 5,
    quote: "The platform helped us organize disaster-relief donations quickly.",
    avatar: "PN",
  },
];

const Movingquotes = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  const baseSpeed = 60;
  const halfWidth = trackWidth ? trackWidth / 2 : 0;
  const duration = halfWidth ? Math.max(10, halfWidth / baseSpeed) : 30;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const calculateWidth = () => {
      if (trackRef.current) {
        const width = trackRef.current.scrollWidth;
        setTrackWidth(width);
      }
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(calculateWidth, 100);

    return () => {
      window.removeEventListener("resize", calculateWidth);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div>
      {/* testimonials */}
      <section id="stories" className="max-w-6xl mx-auto px-6 py-14">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Voices from our Student</h2>
        </div>

        <div
          className="relative overflow-hidden rounded-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            ref={trackRef}
            className="flex gap-6 items-stretch py-6"
            animate={
              paused
                ? {}
                : trackWidth
                ? { x: [0, -(trackWidth / 2)] }
                : { x: 0 }
            }
            transition={
              trackWidth && !paused
                ? { duration, ease: "linear", repeat: Infinity }
                : undefined
            }
            style={{ willChange: "transform" }}
          >
            {doubled.map((t, i) => (
              <Card
                key={`${t.name}-${i}`}
                className="min-w-[320px] max-w-[320px] flex-shrink-0"
              >
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-600">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                      <div className="mt-2 text-sm text-foreground/80 italic">
                        {t.quote}
                      </div>
                      <div className="mt-3">
                        <Smallstar n={t.rating} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* soft masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
      </section>
    </div>
  );
};

export default Movingquotes;
