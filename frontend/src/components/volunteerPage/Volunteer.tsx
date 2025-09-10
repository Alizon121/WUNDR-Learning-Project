import {useEffect, useState } from 'react';
import HeroVolunteer from "./Hero"
import Opportunities from './Opportunities';
import VolunteerForm from './VolunteerForm ';

type TabKey = 'opps' | 'form';

export default function Volunteer(){
    const [tab, setTab] = useState<TabKey>('opps');
    

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.replace('#', '');
        if (hash === 'apply') setTab('form');
        if (hash === 'opportunities') setTab('opps');
    }, []);


   


    return(
        <div className='min-h-screen'>
            <HeroVolunteer />

            {/* Tabs */}
            <div className='max-w-6xl mx-auto px-4 pt-8'>

                {/* Tab strip */}
                <div role='tablist' className='flex gap-8 border-b pt-6 text-xl border-wonderleaf/30'>
                <button
                role="tab"
                aria-selected={tab === 'opps'}
                onClick={() => setTab('opps')}
                className={`pb-3 -mb-px font-semibold transition-colors ${ 
                    tab === 'opps'
                    ? 'text-wondergreen border-b-2 border-wondergreen'
                    : 'text-gray-600 hover:text-wondergreen'
                    }`}
                >
                    Opportunities
                </button>

                <button
                role="tab"
                aria-selected={tab === 'form'}
                onClick={() => setTab('form')}
                className={`pb-3 -mb-px font-semibold transition-colors ${
                    tab === 'form'
                        ? 'text-wondergreen border-b-2 border-wondergreen'
                        : 'text-gray-600 hover:text-wondergreen'
                    }`}
                >
                    Volunteer Application
                </button>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {tab === 'opps' ? <Opportunities /> : <VolunteerForm />}
            </div>
        </div>
         
    )
   

}