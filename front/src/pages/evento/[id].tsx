import { gql, useMutation } from "@apollo/client";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";

const UPDATE_EVENT = gql`
mutation($updateEventId: ID!, $title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!){
    updateEvent(id: $updateEventId, title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
      id
      title
    }
  }

`
export const getServerSideProps: GetServerSideProps = async (context) => {

    const {id}  = context.query

    return {    
        props: {
            id
        }
    }

}

const Page : NextPage<{id:string}> = ({id}) => {

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [date, setDate] = useState<Date>()
    const [startHour, setStartHour] = useState<number>(0)
    const [endHour, setEndHour] = useState<number>(0)

    
  
    
    const [updateEvent] = useMutation(UPDATE_EVENT, {
        variables : {updateEventId : id, title: title, description: description, date: date, startHour: startHour, endHour: endHour },
        onError: (error) => {
          const errorMessage = error.message; 
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement!.textContent = errorMessage; 
        }
    });

  
    return (
    <>
    <input type="datetime-local" placeholder="date" onChange={(e) => {
            
            const date = new Date(e.target.value)
            date.setHours(startHour, 0)
            
            setDate(date)
            
            
            } } />
          <input type="text" placeholder="title" onChange={(e) => { setTitle(e.target.value) }} />
          <input type="text" placeholder="description" onChange={(e) => {  setDescription(e.target.value) }} />
          <input type="number" placeholder="sarathour" onChange={(e) => { setStartHour(parseInt(e.target.value)) }} />
          <input type="number" placeholder="endtHour" onChange={(e) => { setEndHour(parseInt(e.target.value)) }} />
        <button onClick={() => {
            updateEvent();
        }
        }>updatear</button>
        <div id="error-message"></div>

    </>
    );
}

export default Page