import { gql, useMutation, useQuery} from "@apollo/client";
import { dirname } from "node:path/win32";
import { disconnect, eventNames } from "process";
import { use, useEffect, useState } from "react";
import Link from "next/link";


const GET_USERS = gql`
    query{
  listUsers {
    _id
    name
    address
    age
    email
  }
}
`

const DELETE_USER = gql`
mutation($deleteUserId: ID!){
  deleteUser(id: $deleteUserId) {
    name
  }
}
`

const ADD_USER = gql`
mutation($name: String!, $age: Int!, $email: String!, $address: String!){
  addUser(name: $name, age: $age, email: $email, address: $address) {
    _id
    name
  }
}
`

const UPDATE_USER = gql`
mutation($updateUserId: ID!){
  updateUser(id: $updateUserId) {
    email
  }
}
`


const pagina = () => {

    const [name, setName] = useState<string>("")
    const [age, setAge] = useState<number>(0)
    const [address, setAdress] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const [id, setId] = useState<string>("")

    const [vis, setVis] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string>("")


    const { loading, error, data, refetch } = useQuery<{
        listUsers: {
            _id : string
            name : string
            address : string
            age: number
            email: string
        }[];
    }>(GET_USERS);

    const [addUser] = useMutation(ADD_USER,{
        variables : {name, age, address, email},
        onCompleted(){
          refetch()
        },
        onError(error){
          alert(error)
        }
    })

    const [updateUser] = useMutation(UPDATE_USER,{
      variables : {updateUserId : id},
      onCompleted(){
        refetch()
      },
      onError(error){
        alert(error)
      }
  })

    const [delUser] = useMutation(DELETE_USER,{
      variables : {deleteUserId : id},
      onCompleted(){
        refetch()
      },
      onError(error){
        alert(error)
      }
  })

  useEffect(()=>{
    if(id === "" ) return
    delUser()
    },[id])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
      return (
          <>   

          <h1>crear</h1>
          <input type="text" placeholder="name" onChange={(e) => { setName(e.target.value) }} />
          <input type="text" placeholder="adres" onChange={(e) => {  setAdress(e.target.value) }} />
          <input type="text" placeholder="email" onChange={(e) => {  setEmail(e.target.value) }} />
          <input type="number" placeholder="age" onChange={(e) => { setAge(parseInt(e.target.value)) }} />
          <button onClick={()=>{
            addUser()
          }}>add</button>
     
          <h2>TABLA</h2>
          {data?.listUsers.map((user)=>{
            return(
                <>
                {user.name}--
                {user.address}--
                {user.age}--
                {user.email}--
                <button onClick={()=>{
                  setId(user._id)
                }}>eliminar</button>
                <br></br>
                </>

                
            )
          })}
     
          
          </>
      )
  }
  
  export default pagina;