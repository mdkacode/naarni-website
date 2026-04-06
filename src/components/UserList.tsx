// User List Component (Combines Table and Cards)
import React from "react";
import { Row, Col } from "antd";
import type { User } from "../types/user";
import { UserTable } from "./UserTable";
import { UserCard } from "./UserCard";

interface UserListProps {
  users: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, loading = false, onEdit }) => (
  <>
    <div className="hidden md:block">
      <UserTable users={users} loading={loading} onEdit={onEdit} />
    </div>
    <div className="md:hidden">
      <Row gutter={[16, 16]}>
        {users.map(user => (
          <Col xs={24} sm={12} key={user.account?.uuid || user.uuid || user.id}>
            <UserCard user={user} onEdit={onEdit} />
          </Col>
        ))}
      </Row>
    </div>
  </>
);

