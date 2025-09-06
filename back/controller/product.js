import supabase from "../supabase/supabase.js";

// Menambahkan produk dan mengurangi saldo
const addProduct = async (req, res) => {
    const { data: saldoData, error: errorGet } = await supabase
        .from('saldo')
        .select('saldo')
        .eq('id', 1)
        .single();

    if (errorGet) {
        return res.status(500).json({ error: errorGet.message });
    }

    const newBalance = saldoData.saldo;

    if (newBalance < 0) {
        return res.status(400).json({ error: 'Saldo tidak cukup' });
    }

    // Kurangi saldo
    const { data: updateData, error: errorUpdate } = await supabase
        .from('saldo')
        .update({ saldo: newBalance - req.body.price })
        .eq('id', 1);

    if (errorUpdate) {
        return res.status(500).json({ error: errorUpdate.message });
    }

    // Tambah produk
    const { data, error } = await supabase
        .from('product')
        .insert([{
            name: req.body.name,
            price: req.body.price,
            date: req.body.date
        }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ data });
};

//delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('product')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Product deleted successfully', data });
};

// Mendapatkan daftar produk
const getProducts = async (req, res) => {
    const { data, error } = await supabase
        .from('product')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ product: data });
};

// Menyimpan daftar produk ke tabel saved_file
const saveProducts = async (req, res) => {
    const { fileName, products } = req.body;

    if (!fileName || !products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const { data, error } = await supabase
        .from('saved_file')
        .insert([{ name: fileName, data: products }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Products saved successfully' });
};

//lihat semua file yang disimpan
const getSavedFiles = async (req, res) => {
    const { data, error } = await supabase
        .from('saved_file')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ files: data });
};

//view detail file saved (optional)
const getSavedFileById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('saved_file')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ file: data });
};

//delete file saved (optional)
const deleteSavedFile = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('saved_file')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Saved file deleted successfully', data });
};

//delete all products (optional)
const deleteAllProducts = async (req, res) => {
    const { data, error } = await supabase
        .from('product')
        .delete()
        .neq('id', 0); // Menghapus semua produk dengan id tidak sama dengan 0

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'All products deleted successfully', data });
};

export default {
    addProduct,
    deleteProduct,
    getProducts,
    saveProducts,
    getSavedFiles,
    getSavedFileById,
    deleteSavedFile,
    deleteAllProducts
};