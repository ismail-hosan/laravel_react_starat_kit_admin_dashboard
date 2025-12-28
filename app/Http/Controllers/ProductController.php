<?php

namespace App\Http\Controllers;

use App\Helpers\Helper;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(8)
            ->withQueryString(); // keeps search when paginating

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
            ],
            'flash' => [
                'message' => session('message'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
        ]);

        if ($request->hasFile('picture')) {
            $validated['image'] = Helper::uploadFileToPublic('products', $request->file('picture'));
        }

        $product = Product::create($validated);

        return redirect()->route('products.index')->with('message', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);

        return Inertia::render('products/view', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::find($id);

        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
        ]);

        $product = Product::find($id);

        if ($request->hasFile('picture')) {
            if ($product->image) {
                $oldImage = str_replace('storage/', '', $product->image);

                if (Storage::disk('public')->exists($oldImage)) {
                    Storage::disk('public')->delete($oldImage);
                }
            }
            $validated['image'] = Helper::uploadFileToPublic('products', $request->file('picture'));
        }

        $product->update($validated);

        return redirect()->route('products.index')->with('message', 'Product updated successfully.');
    }

    public function statusUpdate(Request $request, $id)
    {
        Product::where('id', $id)->update([
            'status' => $request->status,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            $oldImage = str_replace('storage/', '', $product->image);

            if (Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }
        }

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('message', 'Product deleted successfully.');
    }
}
