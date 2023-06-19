import { gql, useMutation, useQuery} from "@apollo/client";
import { dirname } from "node:path/win32";
import { disconnect } from "process";
import { use, useEffect, useState } from "react";

const GET_EVENTS = gql`
    query{
        events {
        id
        title
        description
        date
        startHour
        endHour
        priority
        }
    }
`

const GET_EVENT_BY_PRIO = gql`
query($priority: Int!){
    eventsByPriority(priority: $priority) {
        id
        title
        description
        date
        startHour
        endHour
        priority
    }
  }
`

const GET_EVENT_TITLE = gql`
query($title: String!){
    eventsBytitle(title: $title) {
        id
        title
        description
        date
        startHour
        endHour
        priority
    }
  }
`

const GET_EVENT_BY = gql`
query($title: String!, $priority: Int!){eventsByTitleAndPriority(title: $title, priority: $priority) {
    id
    title
    description
    date
    startHour
    endHour
    priority
  }}
`


const pagina = () => {

    const [priority , setPriority] = useState<number>(1)
    const [title , setTitle] = useState<string>("")
  
    const { loading, error, data, refetch } = useQuery<{
        events: {
            id : string
            title: string
            description: string
            date : Date
            startHour : number
            endHour : number
            priority : number
        }[];
    }>(GET_EVENTS);

    const { loading : priol, error: prioe, data: priod , refetch: prior } = useQuery<{
        eventsByPriority: {
            id : string
            title: string
            description: string
            date : Date
            startHour : number
            endHour : number
            priority : number
        }[];
    }>(GET_EVENT_BY_PRIO,{
        variables : {priority : priority}
    });

    const {data: td , refetch: tr} = useQuery<{
        eventsBytitle: {
            id : string
            title: string
            description: string
            date : Date
            startHour : number
            endHour : number
            priority : number
        }[];
    }>(GET_EVENT_TITLE,{
        variables : {title : title}
    });

    const {data: tdp , refetch: trp} = useQuery<{
        eventsByTitleAndPriority: {
            id : string
            title: string
            description: string
            date : Date
            startHour : number
            endHour : number
            priority : number
        }[];
    }>(GET_EVENT_BY,{
        variables : {title : title, priority : priority}
    });
    


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

  


    
      return (
          <>

            <input type="number" placeholder="priority" onChange={(e) => { setPriority(parseInt(e.target.value)) }} />
            <input type="text" placeholder="title" onChange={(e) => { setTitle(e.target.value) }} />

            <button onClick={()=>{
                setPriority(1)
            }}>low priority</button>
            <button onClick={()=>{
                setPriority(2)
            }}>medium priority</button>
            <button onClick={()=>{
                setPriority(3)
            }}>hight priority</button>


            <h1>eventos para prioridad: {priority}</h1>
            {priority > 0 && priority <4 ? (<div>
                {data?.events.map((event)=> {
                    if(event.priority === priority){
                        return(
                            <>
                            {event.title}
                            {event.priority}
                            <br></br>
                            </>
                        )
                    }
                })}

            </div>) : <p>prioriad incorrecta</p>}

            <br></br>
            <br></br>
            <br></br>

            {priod?.eventsByPriority.map((event)=>{
                return(
                    <li>
                        {event.title}
                    </li>
                )
            })}

            <br></br>
            <br></br>
            <br></br>

           {tdp?.eventsByTitleAndPriority.map((event)=>{
                return(
                    <li>
                        {event.title}
                        {event.priority}
                        {event.description}
                    </li>
                )
            })
           }
  
          
        
          
          </>
      )
  }
  
  
  export default pagina;