import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

function Students() {
  const [isDropdown, setDropdown] = useState(false);
  return (
    <>
      <div className='h-full my-4'>
        <div className="bg-slate-300/20 rounded flex justify-between px-2 items-center border-t-4 border-t-blue-500">
          <span className='text-2xl py-2 px-1'>Computer</span>
          <span className='mr-2 cursor-pointer' onClick={() => setDropdown(!isDropdown)}>
            {
              isDropdown ?
                <i class="fa-solid fa-caret-down" />
                :
                <i class="fa-solid fa-caret-left" />
            }
          </span>
        </div>
        {
          isDropdown &&
          <div className="text-md">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </Table>
          </div>
        }
      </div>
    </>
  )
}

export default Students
