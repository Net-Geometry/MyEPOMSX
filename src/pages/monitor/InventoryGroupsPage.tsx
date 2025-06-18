import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Box,
  Plus,
  Search,
  Filter,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAssetData } from "@/hooks/lookup/looukp-asset";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// Uncomment these when the hooks are ready to be used
// import {
//   useInventoryGroups,
//   useCreateInventoryGroup,
//   useUpdateInventoryGroup,
//   useDeleteInventoryGroup
// } from "@/hooks/queries/useInventoryGroups";

// Sample data for inventory groups (replace with actual data later)
const sampleInventoryGroups = [
  {
    id: 1,
    asset_id: 1,
    asset_no: "V-110",
    asset_name: "Test Separator",
    group_type: "Pressure Vessels",
    group_name: "Pressure Vessels Group A",
    total_inventory: 12,
    component_inventory: 8,
    description: "High-pressure vessels with similar service conditions",
    equipment_volume: 1500.5,
    representative_component: "V-110A",
    is_active: true,
  },
  {
    id: 2,
    asset_id: 2,
    asset_no: "E-220",
    asset_name: "Heat Exchanger",
    group_type: "Heat Exchangers",
    group_name: "Heat Exchangers - Process Area 2",
    total_inventory: 8,
    component_inventory: 6,
    description: "Shell and tube heat exchangers in high-temperature service",
    equipment_volume: 850.25,
    representative_component: "E-220A",
    is_active: true,
  },
  {
    id: 3,
    asset_id: 3,
    asset_no: "P-330",
    asset_name: "Process Pump",
    group_type: "Piping Systems",
    group_name: "Critical Piping Systems",
    total_inventory: 24,
    component_inventory: 18,
    description: "Critical piping circuits in corrosive service environment",
    equipment_volume: 2200.75,
    representative_component: "P-330A",
    is_active: false,
  },
  {
    id: 4,
    asset_id: 4,
    asset_no: "T-440",
    asset_name: "Storage Tank",
    group_type: "Storage Tanks",
    group_name: "Storage Tanks Group B",
    total_inventory: 6,
    component_inventory: 4,
    description: "Large capacity storage tanks for product storage",
    equipment_volume: 5000.0,
    representative_component: "T-440A",
    is_active: true,
  },
];

interface InventoryGroupFormData {
  asset_id: number | null;
  group_type: string;
  group_name: string;
  total_inventory: string;
  component_inventory: string;
  description: string;
  equipment_volume: string;
  representative_component: string;
  is_active: boolean;
}

const InventoryGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InventoryGroupFormData>({
    asset_id: null,
    group_type: "",
    group_name: "",
    total_inventory: "",
    component_inventory: "",
    description: "",
    equipment_volume: "",
    representative_component: "",
    is_active: true,
  });

  // Get asset data from the hook
  const { data: assets = [], isLoading: isAssetsLoading } = useAssetData();

  // Uncomment these when the backend table is ready
  // const { data: inventoryGroupsData, isLoading, refetch } = useInventoryGroups({
  //   searchQuery: searchQuery.trim() || undefined,
  //   statusFilter: statusFilter !== "all" ? statusFilter : undefined,
  // });

  // const createInventoryGroupMutation = useCreateInventoryGroup();
  // const updateInventoryGroupMutation = useUpdateInventoryGroup();
  // const deleteInventoryGroupMutation = useDeleteInventoryGroup();

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = sampleInventoryGroups;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.group_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.asset_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.asset_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.representative_component
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (statusFilter === "active") return item.is_active;
        if (statusFilter === "inactive") return !item.is_active;
        return true;
      });
    }

    return filtered;
  }, [searchQuery, statusFilter]);

  // Table columns definition
  const columns: Column[] = [
    {
      id: "asset_no",
      header: "Asset No",
      accessorKey: "asset_no",
    },
    {
      id: "asset_name",
      header: "Asset Name",
      accessorKey: "asset_name",
    },
    {
      id: "group_type",
      header: "Group Type",
      accessorKey: "group_type",
    },
    {
      id: "group_name",
      header: "Group Name",
      accessorKey: "group_name",
    },
    {
      id: "total_inventory",
      header: "Total Inventory",
      accessorKey: "total_inventory",
    },
    {
      id: "component_inventory",
      header: "Component Inventory",
      accessorKey: "component_inventory",
    },
    {
      id: "equipment_volume",
      header: "Equipment Volume",
      accessorKey: "equipment_volume",
      cell: (value: number) => `${value.toFixed(2)} L`,
    },
    {
      id: "representative_component",
      header: "Representative Component",
      accessorKey: "representative_component",
    },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: (value: boolean) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setFormData({
      asset_id: null,
      group_type: "",
      group_name: "",
      total_inventory: "",
      component_inventory: "",
      description: "",
      equipment_volume: "",
      representative_component: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setFormData({
      asset_id: item.asset_id,
      group_type: item.group_type,
      group_name: item.group_name,
      total_inventory: item.total_inventory.toString(),
      component_inventory: item.component_inventory.toString(),
      description: item.description,
      equipment_volume: item.equipment_volume.toString(),
      representative_component: item.representative_component,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleRowClick = (row: any) => {
    // Navigate to detail page if needed
    console.log("Row clicked:", row);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.asset_id) {
        toast({
          title: "Validation Error",
          description: "Please select an asset",
          variant: "destructive",
        });
        return;
      }

      if (!formData.group_type.trim() || !formData.group_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate numeric fields
      const totalInventory = parseInt(formData.total_inventory) || 0;
      const componentInventory = parseInt(formData.component_inventory) || 0;
      const equipmentVolume = parseFloat(formData.equipment_volume) || 0;

      if (componentInventory > totalInventory) {
        toast({
          title: "Validation Error",
          description: "Component inventory cannot exceed total inventory",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for submission
      const submitData = {
        asset_id: formData.asset_id,
        group_type: formData.group_type.trim(),
        group_name: formData.group_name.trim(),
        total_inventory: totalInventory,
        component_inventory: componentInventory,
        description: formData.description.trim() || null,
        equipment_volume: equipmentVolume > 0 ? equipmentVolume : null,
        representative_component:
          formData.representative_component.trim() || null,
        is_active: formData.is_active,
        [isEditMode ? "updated_by" : "created_by"]: user?.id || "",
      };

      // When backend is ready, uncomment and use these:
      // if (isEditMode && currentItem) {
      //   await updateInventoryGroupMutation.mutateAsync({
      //     id: currentItem.id,
      //     data: submitData,
      //   });
      // } else {
      //   await createInventoryGroupMutation.mutateAsync(submitData);
      // }

      // For now, just simulate success
      console.log("Form data to submit:", submitData);

      const action = isEditMode ? "updated" : "created";
      toast({
        title: "Success",
        description: `Inventory group ${action} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} inventory group`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      asset_id: null,
      group_type: "",
      group_name: "",
      total_inventory: "",
      component_inventory: "",
      description: "",
      equipment_volume: "",
      representative_component: "",
      is_active: true,
    });
    setCurrentItem(null);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (item: any) => {
    if (
      !window.confirm(`Are you sure you want to delete "${item.group_name}"?`)
    ) {
      return;
    }

    try {
      // When backend is ready, uncomment and use this:
      // await deleteInventoryGroupMutation.mutateAsync(item.id);

      // For now, just simulate success
      console.log("Deleting item:", item);

      toast({
        title: "Success",
        description: "Inventory group deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory group",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Groups"
        subtitle="Manage and view grouped inventory items and their relationships"
        icon={<Box className="h-6 w-6" />}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        addNewLabel="Create Inventory Group"
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by group name, type, asset, or component..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredData}
            onRowClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {isEditMode
                    ? "Edit Inventory Group"
                    : "Create New Inventory Group"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the inventory group details below."
                    : "Fill in the details to create a new inventory group."}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Selection */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="asset_id">
                  Asset <span className="text-red-500">*</span>
                </Label>
                <SearchableSelect
                  options={assets}
                  value={formData.asset_id}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      asset_id: value as number,
                    }))
                  }
                  placeholder="Select an asset"
                  searchBy={(asset) => [asset.asset_no, asset.asset_name || ""]}
                  getLabel={(asset) =>
                    `${asset.asset_no} - ${asset.asset_name || "N/A"}`
                  }
                  getValue={(asset) => asset.id}
                  disabled={isAssetsLoading}
                />
              </div>

              {/* Group Type */}
              <div className="space-y-2">
                <Label htmlFor="group_type">
                  Group Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="group_type"
                  name="group_type"
                  value={formData.group_type}
                  onChange={handleInputChange}
                  placeholder="e.g., Pressure Vessels, Heat Exchangers"
                  required
                />
              </div>

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="group_name">
                  Group Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="group_name"
                  name="group_name"
                  value={formData.group_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Pressure Vessels Group A"
                  required
                />
              </div>

              {/* Total Inventory */}
              <div className="space-y-2">
                <Label htmlFor="total_inventory">Total Inventory</Label>
                <Input
                  id="total_inventory"
                  name="total_inventory"
                  type="number"
                  min="0"
                  value={formData.total_inventory}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              {/* Component Inventory */}
              <div className="space-y-2">
                <Label htmlFor="component_inventory">Component Inventory</Label>
                <Input
                  id="component_inventory"
                  name="component_inventory"
                  type="number"
                  min="0"
                  value={formData.component_inventory}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              {/* Equipment Volume */}
              <div className="space-y-2">
                <Label htmlFor="equipment_volume">Equipment Volume (L)</Label>
                <Input
                  id="equipment_volume"
                  name="equipment_volume"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.equipment_volume}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              {/* Representative Component */}
              <div className="space-y-2">
                <Label htmlFor="representative_component">
                  Representative Component
                </Label>
                <Input
                  id="representative_component"
                  name="representative_component"
                  value={formData.representative_component}
                  onChange={handleInputChange}
                  placeholder="e.g., V-110A"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description of the inventory group"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px] resize-y"
                  rows={3}
                />
              </div>

              {/* Active Status */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryGroupsPage;
