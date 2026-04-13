"use client";

import { CheckboxGroup, TextArea, TextField } from '@radix-ui/themes';
import Link from 'next/link';
import React, { useState, FormEvent } from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsTwitterX } from 'react-icons/bs';
import { MdOutlineAttachEmail, MdOutlineLocationOn } from 'react-icons/md';
import { TbPhoneCall } from 'react-icons/tb';

const GetCustomerDetails = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        services: [] as string[]
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (service: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            services: checked 
                ? [...prev.services, service]
                : prev.services.filter(s => s !== service)
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            alert('Please fill in all required fields!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.msg || 'Failed to send message');
            }

           
            
          
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                services: []
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Form submission failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const servicesList = [
        'Software services',
        'Software development',
        'UI & UX design',
        'Website design',
        'Strategy & consulting',
        'Others'
    ];

    return (
        <div className="bg-primary-900">
            <div className='case-responsive-container py-36'>
                <div className='bg-white shadow-xl rounded-lg p-8 sm:p-8 border border-gray-200'>
                    <div className="relative flex flex-col justify-center items-center text-center">
                        <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold my-4'>
                            Contact <span className='text-primary-700'>Our Team</span>
                        </h1>
                        <p className='text-gray-700'>
                            Got any questions about scaling the products or growing you on our platform? We&apos;re here to help.
                        </p>
                        <p className='text-gray-700'>Chat to our friendly team 24/7.</p>
                    </div>
                    
                    <div className='flex flex-col md:flex-row justify-evenly mt-20 gap-10'>
                        <div className='w-full md:w-1/2'>
                            <form onSubmit={handleSubmit} className='flex flex-col gap-6 font-semibold'>
                                <div className='space-y-2'>
                                    <label className='text-gray-600 text-xs'>Your Name *</label>
                                    <TextField.Root 
                                        radius='large' 
                                        placeholder='Enter Your Name' 
                                        className='w-full'
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className='space-y-2'>
                                    <label className='text-gray-600 text-xs'>Email *</label>
                                    <TextField.Root 
                                        placeholder='Enter Your Email' 
                                        className='w-full'
                                        type='email'
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className='space-y-2'>
                                    <label className='text-gray-600 text-xs'>Phone Number *</label>
                                    <TextField.Root 
                                        radius='large' 
                                        placeholder='Enter Your Phone Number' 
                                        className='w-full'
                                        type='tel'
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className='space-y-2'>
                                    <label className='text-gray-600 text-xs'>Message *</label>
                                    <TextArea 
                                        size='2' 
                                        placeholder='Leave us a message...' 
                                        className='w-full'
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className='grid grid-cols-2 text-sm gap-2'>
                                    <div className='col-span-2 text-gray-600 text-xs'>Services (Optional)</div>
                                    {servicesList.map(service => (
                                        <div className='flex flex-row items-start' key={service}>
                                            <CheckboxGroup.Root
                                                value={formData.services}
                                                onValueChange={e => setFormData(prev => ({ ...prev, services: e }))}
                                                className='pt-0.5 pr-2' size="1"
                                            >
                                                <CheckboxGroup.Item value={service} />
                                            </CheckboxGroup.Root>
                                            <label className='font-medium cursor-pointer' onClick={() => handleCheckboxChange(service, !formData.services.includes(service))}>
                                                {service}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                
                                <div>
                                    <button
                                        type="submit"
                                        className="bg-primary-700 text-white py-2 px-4 rounded-lg hover:bg-primary-900 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className='w-full md:w-1/3'>
                            <div className='flex flex-col gap-6'>
                                <div>
                                    <h2 className='mb-1 text-lg'>Chat with us</h2>
                                    <p className='text-xs text-gray-700'>Speak to our friendly team by chat.</p>
                                    <div className='flex flex-row mt-3'>
                                        <AiOutlineMessage className='mt-1 mr-1' />
                                        <Link href='/' className='text-sm hover:text-gray-700 transition-colors'>
                                            Start a live chat
                                        </Link>
                                    </div>
                                    <div className='flex flex-row mt-3'>
                                        <MdOutlineAttachEmail className='mt-1 mr-1' />
                                        <Link href='mailto:naved@tech-kun.com' className='text-sm hover:text-gray-700 transition-colors'>
                                            Shoot us an email
                                        </Link>
                                    </div>
                                    <div className='flex flex-row mt-3'>
                                        <BsTwitterX className='mt-1 mr-1' />
                                        <Link href='/' className='text-sm hover:text-gray-700 transition-colors'>
                                            Message us on X
                                        </Link>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className='mb-1 text-lg'>Call us</h2>
                                    <p className='text-xs text-gray-500 mb-2'>Call our team Mon-Fri from 8am to 5pm</p>
                                    <div className='flex flex-row'>
                                        <TbPhoneCall className='mt-1 mr-1' />
                                        <a href="tel:+919111335884" className='hover:text-primary-700 transition-colors'>
                                            +91-9111335884
                                        </a>
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className='mb-1 text-lg'>Visit us</h2>
                                    <p className='text-xs text-gray-500 mb-2'>Visit us at our office in Royal Market</p>
                                    <div className='flex flex-row'>
                                        <MdOutlineLocationOn className='mt-1 mr-1' />
                                        <h3>Royal Market, Bhopal, M.P 462001</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetCustomerDetails;