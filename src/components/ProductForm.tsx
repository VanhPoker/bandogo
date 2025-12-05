import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  description: string;
  stock_quantity: number;
  thickness: string;
  size: string;
  features: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  specifications: any;
  images: string[] | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product | null;
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { categories, uploadProductImage, createProduct, updateProduct } = useProducts();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('price', initialData.price);
      setValue('category', initialData.category);
      setValue('description', initialData.description || '');
      setValue('stock_quantity', initialData.stock_quantity);

      if (initialData.specifications) {
        setValue('thickness', initialData.specifications.thickness || '');
        setValue('size', initialData.specifications.size || '');
        if (initialData.specifications.features) {
          setFeatures(initialData.specifications.features);
        }
      }

      if (initialData.images) {
        setUploadedImages(initialData.images);
      }
    } else {
      reset();
      setUploadedImages([]);
      setFeatures([]);
    }
  }, [initialData, setValue, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsSubmitting(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadProductImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...imageUrls]);
      toast.success(`Tải lên ${imageUrls.length} ảnh thành công`);
    } catch (error) {
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (uploadedImages.length === 0) {
      toast.error('Vui lòng tải lên ít nhất một ảnh sản phẩm');
      return;
    }

    setIsSubmitting(true);
    try {
      const specifications = {
        thickness: data.thickness,
        size: data.size,
        features: features
      };

      const productData = {
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        specifications,
        images: uploadedImages,
        stock_quantity: data.stock_quantity,
        is_active: true
      };

      if (initialData) {
        await updateProduct(initialData.id, productData);
      } else {
        await createProduct(productData);
      }

      // Reset form
      reset();
      setUploadedImages([]);
      setFeatures([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', {
                  required: 'Giá là bắt buộc',
                  min: { value: 0, message: 'Giá phải lớn hơn 0' }
                })}
                placeholder="Nhập giá sản phẩm"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                onValueChange={(value) => setValue('category', value)}
                defaultValue={initialData?.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Số lượng tồn kho *</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register('stock_quantity', {
                  required: 'Số lượng tồn kho là bắt buộc',
                  min: { value: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                })}
                placeholder="Nhập số lượng"
              />
              {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Nhập mô tả sản phẩm"
              rows={3}
            />
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thickness">Độ dày</Label>
              <Input
                id="thickness"
                {...register('thickness')}
                placeholder="VD: 18mm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Kích thước</Label>
              <Input
                id="size"
                {...register('size')}
                placeholder="VD: 2440x1220mm"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Tính năng đặc biệt</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Nhập tính năng"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {features.map((feature) => (
                <Badge key={feature} variant="secondary" className="gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">Hình ảnh sản phẩm *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nhấp để tải ảnh lên hoặc kéo thả ảnh vào đây
                </p>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : (initialData ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};