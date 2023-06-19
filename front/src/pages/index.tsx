import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Event from "@/components/Event"


export default function Home() {
  return (
    <>
      <Event/>
    </>
  )
}
