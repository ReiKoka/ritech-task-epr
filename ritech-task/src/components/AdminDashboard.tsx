import { FaIndustry, FaUsers, FaUsersGear } from "react-icons/fa6";
import SmallBox from "./SmallBox";
import { HiClipboardDocumentList } from "react-icons/hi2";

import { useAllUsers } from "@/hooks/manager/user/useAllUsers";
import { Department, EditUserDataType, User } from "@/utils/types";
import { useAllReviews } from "@/hooks/manager/review/useAllReviews";

import LargeBox from "./LargeBox";
import { DataTable } from "@/utils/tableUtils/dataTable";
import {
  dashboardPageColumns,
  UserTableColumns,
} from "@/utils/tableUtils/columns";

import { useAllDepartments } from "@/hooks/manager/department/useAllDepartments";
import { GoalsChart } from "./GoalsChart";
import { useAllGoals } from "@/hooks/manager/goals/useAllGoals";
import { createUsersWithDepartments } from "@/utils/helperFunctions";
import UserForm from "./user/UserForm";
import { useIds } from "@/context/IdsContext";
import Loader from "./Loader";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEditUser } from "@/hooks/manager/user/useEditUser";
import { useModal } from "@/context/ModalContext";



function AdminDashboard() {

  const { isLoading: isLoadingAllUsers, allUsers } = useAllUsers();
  const { isLoading: isLoadingAllGoals, allGoals } = useAllGoals();
  const { isLoading: isLoadingAllReviews, allReviews } = useAllReviews();
  const { isLoading: isLoadingAllDepartments, allDepartments } =
    useAllDepartments();

  const { editUser } = useEditUser();
  const { closeModal } = useModal();
  const { selectedId } = useIds();
  const methods = useForm<EditUserDataType>();

  const usersWithDepartments = createUsersWithDepartments(
    allUsers as User[],
    allDepartments as Department[],
  );

  console.log(allDepartments);

  const onSubmit: SubmitHandler<EditUserDataType> = (data) => {
    editUser({ id: Number(selectedId), data });
    closeModal();
  };

  if (
    isLoadingAllUsers ||
    isLoadingAllDepartments ||
    isLoadingAllGoals ||
    isLoadingAllReviews
  )
    return <Loader />;

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="font-primary text-3xl font-semibold">Dashboard</h1>
      <section className="grid grid-cols-4 grid-rows-[6rem_1fr] gap-x-8">
        <SmallBox
          icon={FaUsers}
          text="Employees"
          value={allUsers?.length as number}
        />

        <SmallBox
          icon={FaUsersGear}
          text="Managers"
          value={
            allUsers?.filter((user) => user.role === "manager").length as number
          }
        />

        <SmallBox
          icon={FaIndustry}
          text="Departments"
          value={allDepartments?.length as number}
        />

        <SmallBox
          icon={HiClipboardDocumentList}
          text="Reviews"
          value={allReviews?.length as number}
        />
      </section>

      <section className="flex w-full gap-x-8">
        <LargeBox
          title="Users Overview"
          children={
            <DataTable
              columns={dashboardPageColumns}
              data={(usersWithDepartments as UserTableColumns[]) || []}
            />
          }
        />
        <LargeBox
          title="Goal's performance"
          children={
            <div className="overflow-hidden">
              <GoalsChart allGoals={allGoals || []} />
            </div>
            
          }
          className="overflow-hidden"
        />
      </section>
      <UserForm
        userId={selectedId as number}
        methods={methods}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AdminDashboard;