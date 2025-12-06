# Refined Requirements

---

## **User Authentication & Profile**

- Users will log in for the first time using their mobile number and the system-generated password (their User ID in the format: `ZVGXXXXXXXX`).
- Users can change their password through the **Change Password** option.
- After changing the password, the user will be logged out from the current session and will need to log in again using the new password.
- Users should be able to **register** and **log in**.
- After login, users should be redirected to their **dashboard**.
- Users can view their personal details but **cannot edit** them.

---

## **Dashboard Features**

- The dashboard displays the list of **upcoming** and **past appointments**.
- Users can request **rescheduling** of appointments.
- Reschedule requests will be sent to the **Admin/Assistant** for approval.
- The appointment will be updated in the database **only if the request is approved**.
- If the request is rejected, the user will see the **rejected status** in their dashboard.
- Users can view:
  - Medicines prescribed by the doctor
  - Complete medicine history
  - Advice given by the doctor
- Users can also view the **history of appointments** along with related doctor advice.
- Dashboard contains the list of appointments the have upcoming and past.
- Also they can also request for re-schedule of the appointment.
But the request will go to the admin/Assistant for approval. 
- If they have approved then only will be updating the db. Else the request will get rejected and the user will be able to see the rejected request.
- Also User will be able to see the medicine given by the doctor and also the history of the medicine given to them and also the related advice given by the doctor.
---

## **Medicine Order Flow**

- Users will be able to view all available medicines and their prices from the **Medicines Page**  
  (visibility after login or public access — still to be finalized).
- If the Medicines Page is publicly accessible and a user tries to add a medicine to the cart, they will be prompted to **log in/register**.
- After login/registration, the user will be redirected back to the **Medicines Page** and can continue adding medicines to the cart.
- Users will have the option to **proceed to payment**.
- All purchase history will be stored in the database.
- Users can view their **complete purchase history**.
- Users can also see the **current status** of orders (e.g., delivery ETA).
- Users will be able to request a **return/replace** of medicines based on the condition at the time of delivery.
- Users can view the **return/replace history**.
- Users can **rate medicines**.
- Users can view their **rating history**.
- Users can view **detailed information** about each medicine.





## Old Flow Improvements:
    1. Passowrd change flow
    2. Status is not getting updated based on the flow and pages
    3. Existing Contact page will only contain the map section
    4. The register will be now only for users.
    5. File upload and delete option form Cloudinary will be done later /includes the icon image.



## To Do:
    1. Costing of OTP
    2. hosting cost for UI and backend