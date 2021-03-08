import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Table } from 'reactstrap';
import Axios from 'axios';
import './App.css';


const App = (props) => {

  const [dropdownOpen, setOpen] = useState(false);

  const [modal, setModal] = useState(false);
  const [adduser, setAddUser] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState();
  const [file, setFile] = useState('');

  const [gender, setGender] = useState("");
  const [editableData, setEditableData] = useState(null);
  const [data, setdata] = useState(false)
  const [isDeleted, setIsDelete] = useState(false)



  const submitData = (e) => {
    e.preventDefault();
    const insertData = { name: name, email: email, contact: contact, role: role, file: file, gender: gender }

    setName("");
    setEmail("");
    setContact("");
    setRole("");
    setFile("");
    setGender("");
    toggle()
  }

  const setToggle = (e) => {
    setRole(e.target.value);
    console.log(role)
  }


  const onChangeValue = (e) => {
    setGender(e.target.value);
  }

  const accessData = async (e) => {
    try {
      const apiUrl = ("http://localhost:3001/data");
      const res = await Axios.get(apiUrl);
      setAddUser(res.data.filter(item => item.isDeleted === false));
    } catch (error) {
      console.log(error)
    }
  }
  const deleteRecord = async (id) => {
    alert("Are you sure")
  

    try {
      console.log(id)
      await Axios.patch(`http://localhost:3001/data/${id}`, {
        isDeleted:true,
        
      })
      


    } catch (error) {
      console.log({ error })
    }
    accessData();
  }

  //create data
  const onFormdata = async () => {

    try {
      if (name == "" || email == "" || contact == "" || role == "" || file == "" || gender == "") {
        alert("Please submit value")

      } else {
        const responseData = await Axios.post('http://localhost:3001/data', {
          name: name,
          email: email,
          contact: contact,
          role: role,
          file: file,
          gender: gender,
          isDeleted: false,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        let newData = [...adduser];
        newData.push(responseData)
        accessData(newData)
        alert("successfully added user")

      }

    }
    catch (error) {
      console.log(error)
    }
  }

  const updateddata = (id) => {
    toggle()
    // console.log(id)
    const dataone = adduser.find(obj => obj.id === id);
    setEditableData(dataone);

  }

  useEffect(() => {
    accessData()
  }, [])

  useEffect(() => {
    if (editableData) {
      setName(editableData.name);
      setEmail(editableData.email);
      setContact(editableData.contact);
      setRole(editableData.role);
      setFile(editableData.file);
      setGender(editableData.gender);
    } else {
      setName("");
      setEmail("");
      setContact("");
      setRole("");
      setFile("");
      setGender("");
    }
  }, [editableData])
  const toggle = () => {
    setEditableData(null)
    setModal(!modal);

  }

  const patchData = async (id) => {
    try {
      const newUpdate = await Axios.put(`http://localhost:3001/data/${id}`, {
        name: name,
        email: email,
        contact: contact,
        role: role,
        file: file,
        gender: gender,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      let updateData = [...adduser];
      updateData.splice(updateData, newUpdate)
      accessData(updateData)
      // setName("");
      // setEmail("");
      // setContact("");
      // setRole("");
      // setFile("");
      // setGender("");
      toggle();
      alert("successfully update")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App my-3">
      <Button color="danger" onClick={toggle}>Add User</Button>
      <div className="App my-3">
        <Modal isOpen={modal} toggle={toggle} >
          <ModalHeader toggle={toggle}>User Form</ModalHeader>
          <div className="modeldata">
            <Form onSubmit={submitData}>
              <FormGroup>
                <Label for="exampleEmail">Name</Label>
                <Input type="text" name="name" maxLength={"20"} value={name} onChange={(e) => setName(e.target.value)} id="exampleName" required />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} id="exampleEmail" required />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Contact</Label>
                <Input type="text" name="contact" placeholder="+91" maxLength={"10"} value={contact} onChange={(e) => setContact(e.target.value)} id="exampleContact" required />
              </FormGroup>
              <Label check for="Role">
                Role
              </Label>
              <select name="role" className="form-control" required value={role} onChange={(e) => setToggle(e)}>
                <option>Plase select</option>
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>

              <input className="roledata" type="file" onChange={(e) => setFile(URL.createObjectURL(e.target.files[0]))} />

              <div name="gender" >
                <input type="radio" onChange={(e) => onChangeValue(e)} checked={gender === "Male"} value="Male" name="gender" /> Male
                <input type="radio" onChange={(e) => onChangeValue(e)} checked={gender === "Female"} value="Female" name="gender" /> Female
                <input type="radio" onChange={(e) => onChangeValue(e)} checked={gender === "Other"} value="Other" name="gender" /> Other
              </div>

              <ModalFooter>
                {editableData ? <Button color="success" onClick={() => patchData(adduser[0].id)} >update</Button> : <Button color="primary" type="submit" onClick={onFormdata}>Add User</Button>}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
              </ModalFooter>
            </Form>
          </div>
        </Modal>
      </div>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Gender</th>
              <th>Role</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              adduser.map((currentData) => {
                const { id, name, email, contact, gender, role, file } = currentData;
                return (
                  <>
                    <tr>
                      <td key={id}>{id}</td>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>{contact}</td>
                      <td>{gender}</td>
                      <td>{role}</td>
                      <td><img style={{ width: "50px" }} src={file} /></td>
                      <td> <Button color="danger" onClick={() => deleteRecord(id, data)} >delete</Button> &nbsp;&nbsp; <Button color="success" onClick={() => updateddata(id)} >update</Button>
                      </td>
                    </tr>
                  </>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default App
