import { useState, useEffect } from "react";
import { AlertCircle, Ban, Edit, Search, Trash, UserPlus2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/configs/axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/info";
import ShimmerButton from "../ui/shimmer-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(0, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female"]).optional(),
  role: z.string().min(1, "Role is required"),
});

type UserFormData = z.infer<typeof userSchema>;

// Define Zod schema for ban reason
const banReasonSchema = z.object({
  reason: z
    .string()
    .min(5, "Please provide a reason with at least 5 characters."),
});

type BanReasonFormData = z.infer<typeof banReasonSchema>;

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Additional state for managing the ban dialog
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");
  const formBan = useForm<BanReasonFormData>({
    resolver: zodResolver(banReasonSchema),
    defaultValues: { reason: "" },
  });

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Staff":
        return "bg-red-100 text-red-800";
      case "Manager":
        return "bg-yellow-100 text-yellow-800";
      case "Customer":
        return "bg-green-100 text-green-800";
      case "Vet":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
      gender: "male",
      role: "",
    },
  });

  const fetchUser = async () => {
    try {
      const response = await api.get("User/all-user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (error: any) {
      console.error("Failed to fetch user data:", error.message);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAdd = () => {
    setIsEditMode(false);
    form.reset({
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
      gender: "male",
      role: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditMode(true);
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      password: "",
      email: user.email,
      gender: user.gender ? "male" : "female",
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (isEditMode && currentUser) {
        await api.patch(
          `/User/update-role-user/${currentUser.userID}/${data.role}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("User role updated successfully");
      } else {
        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          password: data.password,
          email: data.email,
          gender: data.gender === "male",
          role: data.role,
        };
        const response = await api.post(`/User/create-user`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success(response.data);
      }
      fetchUser();
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Operation failed:", error.response?.data || error.message);
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/User/delete-user/${userToDelete.userID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Deleted user successfully");
      setUsers(users.filter((user) => user.userID !== userToDelete.userID));
      setFilteredUsers(
        filteredUsers.filter((user) => user.userID !== userToDelete.userID)
      );
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      setError(error.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Updated ban function to include a reason
  const handleBanSubmit = async (data: BanReasonFormData) => {
    try {
      await api.patch(
        `/User/ban-user/${userToBan?.userID}`,
        { reason: data.reason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("User banned successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === userToBan?.userID
            ? { ...user, isActive: false }
            : user
        )
      );
      setIsBanModalOpen(false);
    } catch (error: any) {
      toast.error("Failed to ban user. Please try again.");
    }
  };

  // Function to open the ban dialog and set the user to ban
  const openBanDialog = (user: User) => {
    setUserToBan(user);
    setIsBanModalOpen(true);
    form.reset(); // Clear the reason field each time dialog opens
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-xl p-6 border border-blue-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-white text-gray-800 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value.toLowerCase());
              const filtered = users.filter(
                (user) =>
                  user.firstName
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  user.lastName
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
              );
              setFilteredUsers(filtered);
            }}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <ShimmerButton onClick={handleAdd}>
          <UserPlus2 className="mr-2" />
          Add User
        </ShimmerButton>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800">
              {isEditMode ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="First Name"
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Last Name"
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Username"
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email"
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Vet">Vet</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading
                    ? isEditMode
                      ? "Saving..."
                      : "Adding..."
                    : isEditMode
                    ? "Save"
                    : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {error ? (
        <div className="text-red-600 text-sm mb-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-100 via-blue-50 to-white">
              <TableRow>
                <TableHead className="font-semibold text-blue-800">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-blue-800">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-blue-800">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-blue-800">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-blue-800">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.userID}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openBanDialog(user)}
                          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog open={isBanModalOpen} onOpenChange={setIsBanModalOpen}>
            <DialogContent className="sm:max-w-[400px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-yellow-800">
                  Ban User
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-500">
                Please provide a reason for banning this user. This action is
                permanent.
              </p>
              <Form {...formBan}>
                <form
                  onSubmit={formBan.handleSubmit(handleBanSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={formBan.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ban Reason</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reason for banning"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsBanModalOpen(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      Ban User
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="text-red-600 mr-3">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Deactivate account
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this account? All of this data
              will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;
