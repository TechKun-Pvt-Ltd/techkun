'use client'
import Banner from "@/app/sections/Banner";
import Cofounders from "@/app/sections/Cofounders";
import ContactUs from "@/app/sections/ContactUs";
import MeetTechKun from "@/app/sections/MeetTechKun";
import {css} from "@emotion/react";

export default function Home() {
    return <>
        <Banner />
        <MeetTechKun />
        <Cofounders />
        <ContactUs />
    </>;
  // return (
  //   <div>
  //     <Banner />
  //     <AboutUs />
  //     <ClientSliderSection />
  //     <OurProducts />
  //     <Services />
  //     <WhatWeDo />
  //     <ContractingSteps />
  //     <WhyChooseUs />
  //     <CTASection />
  //     <Stats/>
  //   </div>
  // );
}