import { gql, useMutation, useQuery} from "@apollo/client";
import { dirname } from "node:path/win32";
import { disconnect, eventNames } from "process";
import { use, useEffect, useState } from "react";
import styled from "styled-components";
import { ObjectId } from 'mongodb';
import Link from "next/link";


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

const CREATE_EVENT = gql`
  mutation($title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!, $priority: Int!){
    createEvent(title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour, priority: $priority) {
      title
      id
    }
  }
`

const UPDATE_EVENT = gql`
mutation($updateEventId: ID!, $title: String!, $description: String!, $date: Date!, $startHour: Int!, $endHour: Int!){
    updateEvent(id: $updateEventId, title: $title, description: $description, date: $date, startHour: $startHour, endHour: $endHour) {
      id
      title
    }
  }

`

const DELETE_EVENT = gql`

mutation($deleteEventId: ID!){
    deleteEvent(id: $deleteEventId) {
      title
      id
    }
  }

`

const TOGGLE_EVENT = gql`
  mutation($toggleEventId: ID!){
    toggleEvent(id: $toggleEventId) {
      title
      priority
    }
  }
`

const pagina = () => {

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [date, setDate] = useState<Date>()
    const [startHour, setStartHour] = useState<number>(0)
    const [endHour, setEndHour] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0);


    
    const [title2, setTitle2] = useState<string>("")
    const [description2, setDescription2] = useState<string>("")
    const [date2, setDate2] = useState<Date>()
    const [startHour2, setStartHour2] = useState<number>(0)
    const [endHour2, setEndHour2] = useState<number>(0)


    const [id, setId] = useState<string>("")
    const [id2, setId2] = useState<string>("")
    const [id3, setId3] = useState<string>("")
    const [e, sete] = useState<number>(0)
    const [e2, sete2] = useState<number>(0)
    const [isDivVisible, setDivVisible] = useState<boolean>(false);
    const [selectedEventId, setSelectedEventId] = useState<string>("")

    const[max, setMax] = useState<number>(6)
    const[min, setMin] = useState<number>(0)
    const[page, setPage] = useState<number>(1)
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

    const [createEvent] = useMutation(CREATE_EVENT, {
        variables : {title,description,date,startHour,endHour, priority},
        onCompleted: () => {
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.message; 
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement!.textContent = errorMessage; 
        }
    });

    const [toggleEvent] = useMutation(TOGGLE_EVENT, {
      variables : {toggleEventId : id3},
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {
       alert(error)
      }
  });


    
    const [deleteEvent] = useMutation(DELETE_EVENT, {
        variables : {deleteEventId: id},
        onCompleted: () => {
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.message; 
          const errorMessageElement = document.getElementById('error-message2');
          errorMessageElement!.textContent = errorMessage; 
        }
    });

    const [updateEvent] = useMutation(UPDATE_EVENT, {
      variables : {updateEventId : id2, title: title2, description: description2, date: date2, startHour: startHour2, endHour: endHour2 },
      onCompleted: () => {
         refetch()
      },
      onError: (error) => {
        const errorMessage = error.message; 
        const errorMessageElement = document.getElementById('error-message3');
        errorMessageElement!.textContent = errorMessage; 
      }
  });



    useEffect(() =>{
        if(id == "") return
        deleteEvent()
    },[id])


    useEffect(() =>{
      if(id2 == "") return
      updateEvent()
   },[id2,e])

   useEffect(() =>{
    if(id3 == "") return
      toggleEvent()
    },[e2])



    const toggleDivVisibility = () => {
      setDivVisible(!isDivVisible);
    };
  


  

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    
      return (
          <>   
          <Titulo>Crear</Titulo>
          <input type="datetime-local" placeholder="date" onChange={(e) => {
            
            const date = new Date(e.target.value)
            date.setHours(startHour, 0)
            
            setDate(date)
            
            
            } } />
          <input type="text" placeholder="title" onChange={(e) => { setTitle(e.target.value) }} />
          <input type="text" placeholder="description" onChange={(e) => {  setDescription(e.target.value) }} />
          <input type="number" placeholder="sarathour" onChange={(e) => { setStartHour(parseInt(e.target.value)) }} />
          <input type="number" placeholder="endtHour" onChange={(e) => { setEndHour(parseInt(e.target.value)) }} />
          <input type="number" placeholder="priority" onChange={(e) => { setPriority(parseInt(e.target.value)) }} />
        <Button onClick={() => {
            createEvent();
        }
        }>crear</Button>
        
          <div id="error-message"></div>
          <div id="error-message2"></div>
          <div id="error-message3"></div>
          <Titulo>Eventos de ahora en adelante. Pag: {page}</Titulo>

          <Formulario>
        <Button onClick={()=>{
          if(max >= (data!.events.length)-1) return
           setMin(min+7)
           setMax(max+7)
           setPage(page+1)
        }}>siguiente</Button>
        <Button onClick={()=>{
          if(min === 0) return
          setMin(min-7)
          setMax(max-7)
          setPage(page-1)
        }}>anterior</Button>
          <Celda></Celda>
          <Celda></Celda>
          <Celda></Celda>
          <Celda></Celda>
          <Celda></Celda>
          <Celda></Celda>
          <Celda></Celda>

          <Header>titulo</Header>
          <Header>description</Header>
          <Header>fecha</Header>
          <Header>starthour</Header>
          <Header>endHour</Header>
          <Header>priority</Header> 
          <Header></Header> 
          <Header></Header> 
          <Header></Header>     
           {data?.events.map((event, index) => {


              if( index >= min && index <= max ) {  
            return (
                <>
                     <Celda>{<Link href={`/evento/${event.id}`}>{event.title}</Link>}</Celda>
                     <Celda> {<Link href={`/evento2/${event.id}`}>{event.description}</Link>}</Celda>
                     <Celda>{event.date.toString().substring(0,10)}</Celda>
                     <Celda>{event.startHour}</Celda>
                     <Celda>{event.endHour}</Celda>
                     <Celda>{event.priority}</Celda>
                     <Celda>
                     <Button2 onClick={() => {
                        setId(event.id)
                    }}>delete</Button2>
                     </Celda>
                     <Celda>
                     <Button2 onClick={()=>{
                        setId3(event.id)
                        sete2(e2+1)                        
                    }}>toggle</Button2>
                     </Celda>
                     <Celda>
                    <Button2 onClick={()=>{
                        toggleDivVisibility()
                        setSelectedEventId(event.id)                 
                    }}>update</Button2>
                     </Celda>
                     
                    { isDivVisible && selectedEventId === event.id && (<>

                      <input type="datetime-local" placeholder="date" onChange={(e) => {
                                
                                const date = new Date(e.target.value)
                                date.setHours(startHour, 0)
                                
                                setDate2(date)
                                
                                
                                } } />
                              <input type="text" placeholder="title" onChange={(e) => { setTitle2(e.target.value) }} />
                              <input type="text" placeholder="description" onChange={(e) => {  setDescription2(e.target.value) }} />
                              <input type="number" placeholder="sarathour" onChange={(e) => { setStartHour2(parseInt(e.target.value)) }} />
                              <input type="number" placeholder="endtHour" onChange={(e) => { setEndHour2(parseInt(e.target.value)) }} />
                            <Button onClick={() => {
                              setId2(event.id)
                              sete(e+1)
                            }
                            }>updatear</Button>
                            <Celda></Celda>
                            <Celda></Celda>
                            <Celda></Celda>
                          

                      </>)
                  }
                  

                    
                    
            
                </>
            )
                  }
          })}
          </Formulario>
          
          </>
      )
  }
  
  export default pagina;


  

const Formulario = styled.div`
border: 1px solid #ccc;
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
grid-gap: 1px;
background-color: #fff;
color: #444;
margin-bottom: 50px;
`;

const Header = styled.div`
background-color: #f1f1f1;
font-weight: bold;
padding: 20px;
text-align: left;
`;

const Celda = styled.div`
padding: 10px 20px 10px 20px;
text-align: left;
border-bottom: 1px solid #ddd;
`;

const Titulo = styled.div`
background-color: blue;
font-weight: bold;
padding: 20px;
text-align: left;
color: white;
`;

const Button = styled.button`
background-color: white;
color: black;
border: 2px solid blue;
padding: 16px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
transition-duration: 0.4s;
cursor: pointer;

&:hover {
  background-color: blue;
  color: white;
}
`;

const Button2 = styled.button`
background-color: white;
color: black;
border: 2px solid red;
padding: 16px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
transition-duration: 0.4s;
cursor: pointer;

&:hover {
  background-color: red;
  color: white;
}
`;