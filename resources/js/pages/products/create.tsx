import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a product',
        href: '/products/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: 'apple',
        price: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products'); 
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a product" />
            <div className='max-w-8/12 p-4'>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='gap-1.5'>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder='Product Name'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type='number'
                            placeholder='Product Price'
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                    </div>

                    <div className='gap-1.5'>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder='Product Description'
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                    </div>

                    <div className='gap-1.5'>
                        <Button type='submit' disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
