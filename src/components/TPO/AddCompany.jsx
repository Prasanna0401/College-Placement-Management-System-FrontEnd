import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import { BASE_URL } from '../../config/config';

function AddCompany() {
  document.title = 'CPMS | Add Company';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { companyId } = useParams();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.companyName || !data?.companyDescription || !data?.companyDifficulty || !data?.companyLocation || !data?.companyWebsite)
      return setError("All Fields Required!");
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/company/add-company`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      if (response?.data?.msg === "Company Created Successfully!") {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg
        }
        navigate('../tpo/companys', { state: dataToPass });
      }
      if (response?.data?.msg === "Company Name Already Exist!") {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setData(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (companyId) fetchCompanyData() }, [companyId])


  useEffect(() => {
    if (!companyId) setLoading(false);
  }, [])


  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value })
  }


  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="my-8 text-base backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400 p-6 max-sm:text-sm max-sm:p-3">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                    <FloatingLabel controlId="floatingCompanyName" label={
                      <>
                        <span>Company Name <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Control
                        type="text"
                        placeholder="Company Name"
                        name='companyName'
                        value={data?.companyName || ''}
                        onChange={handleDataChange}

                      />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingCompanyLocation" label={
                      <>
                        <span>Company Location <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Control
                        type="text"
                        placeholder="Company Location"
                        name='companyLocation'
                        value={data?.companyLocation || ''}
                        onChange={handleDataChange}

                      />
                    </FloatingLabel>
                  </div>
                  <FloatingLabel controlId="floatingCompanyWebsite" label={
                    <>
                      <span>Company Website <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Control
                      type="link"
                      placeholder="Company Website"
                      name='companyWebsite'
                      value={data?.companyWebsite || ''}
                      onChange={handleDataChange}

                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelectDifficulty" label={
                    <>
                      <span>Difficulty Level <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Select
                      aria-label="Floating label select difficulty"
                      className='cursor-pointer'
                      name='companyDifficulty'
                      value={data?.companyDifficulty || ''}
                      onChange={handleDataChange}

                    >
                      <option disabled value='' className='text-gray-400'>Enter Difficulty Level</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingcompanyDescription" label={
                    <>
                      <span>Company Description <span className='text-red-500'>*</span></span>
                    </>
                  }>
                    <Form.Control
                      as="textarea"
                      placeholder="Company Description"
                      name='companyDescription'
                      style={{ height: '100px', maxHeight: "450px" }}
                      value={data?.companyDescription || ''}
                      onChange={handleDataChange}

                    />
                  </FloatingLabel>
                </div>
                {
                  error &&
                  <div className="flex pt-2">
                    <span className='text-red-500'>{error}</span>
                  </div>
                }
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <Button variant="primary" type='submit' size='lg'>Add Company</Button>
              </div>
            </Form>
          </>
        )
      }


      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to add company ${data?.companyName}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}
export default AddCompany
