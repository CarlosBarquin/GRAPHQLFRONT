import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { getSSRClient } from "@/libs/client";
import styled from "styled-components";

type data = {

   event : {
        id: string;
        title: string;
        description: string;
        date: Date;
        startHour: number;
        endHour: number;
        priority: number;
    }

}

export const getStaticPaths: GetStaticPaths = async () => {

  const query = gql`
  query{
    events {
      id
    }
  }
  `;



const client = getSSRClient();

  const {data} = await client.query<{
    events: {
        id: string
    }[];
  }>({
    query
  })




  const paths = data!.events.map(( event) => {
    return {
      params: {
        id: event.id
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

  
  const id = params?.id;

  const query = gql`
  query($eventId: ID!){
    event(id: $eventId) {
        id
        title
        description
        date
        startHour
        endHour
        priority
    }
  }
  `;
  const client = getSSRClient();

  const { data } = await client.query<{
    event: {
        id : string
        title: string
        description: string
        date : Date
        startHour : number
        endHour : number
        priority : number
    }
  }>({
    query,
    variables: {
        eventId : id
    },
  });


  
  return {
    props: {
      data,
    },
  };
}

const Index: NextPage<{ data: data }> = ({ data }) => {
  return (
    <>
      <h1>DATOS</h1>
      <ul>
        {data.event.description}--
        {data.event.id}
      </ul>

      
    </>
  );
}

export default Index;

const Titulo = styled.div`
background-color: blue;
font-weight: bold;
padding: 20px;
text-align: left;
color: white;
`;