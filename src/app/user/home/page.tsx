"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/user/header';

export default function Home() {
  const router = useRouter();


  

  return (
    <div>
      <Header/>

    </div>
  );
}
