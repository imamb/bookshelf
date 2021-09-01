const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler=(request,h)=>{
    
    //if(request.payload.isJson()){
        const {name,year,author,summary,publisher,pageCount,readPage,reading}= request.payload;
    //}
    //else{
    //    const {name,year,author,summary,publisher,pageCount,readPage,reading}= JSON.parse(request.payload);
    //}
    const id=nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    //const reading = false;
    
    const finished = pageCount===readPage;
    if(pageCount<readPage){
        const response=h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if(name===undefined){
        const response=h.response({
            status: 'fail',
            message: `Gagal menambahkan buku. Mohon isi nama buku`,
        });
        response.code(400);
        return response;
    }

    const newBook={
        id,name,year,author,summary,publisher,pageCount,readPage,finished,reading,insertedAt,updatedAt,
    };

    books.push(newBook);
    const isSuccess = books.filter((book)=>book.id===id).length>0;

    if(isSuccess){
        const response=h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data:{
                bookId:id,
            }
        });
        response.code(201);
        return response
    }
    const response=h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler=(request,h)=>{
    if(request.query.name !== undefined){
        const{name}=request.query;
        const book=books.filter((n)=>n.name.toUpperCase().includes(name.toUpperCase()));
        if(book !== undefined){
            return{
                status: 'success',
                data:{
                    books:book.map((buku) => ({
                        id: buku.id,
                        name: buku.name,
                        publisher: buku.publisher,
                    })),
                },
            };
        }
        return{
                status: 'error',
                message: `tidak ada buku yang mengandung kata ${name}`,
        };
    }
    else if(request.query.reading !== undefined){
        const{ reading }=request.query;
        const baca = (reading===0? false:true);
        const book=books.filter((n)=>n.reading===baca);
        if(book !== undefined){
            return{
                status: 'success',
                data:{
                    books:book.map((buku) => ({
                        id: buku.id,
                        name: buku.name,
                        publisher: buku.publisher,
                    })),
                },
            };
        }
        return{
                status: 'error',
                message: `tidak ada buku dengan status reading ${reading}`,
        };
    }
    else if(request.query.finished !== undefined){
        const{finished}=request.query;
        const baca = (finished===0? false:true);
        const book=books.filter((n)=>n.finished===baca);
        if(book !== undefined){
            return{
                status: 'success',
                data:{
                    books:book.map((buku) => ({
                        id: buku.id,
                        name: buku.name,
                        publisher: buku.publisher,
                    })),
                },
            };
        }
        return{
            status: 'error',
            message: `tidak ada buku dengan status finished ${finished}`,
    };
    }else {
        return{ 
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }
};

const getBookByIdHandler=(request,h)=>{
    const{bookId}=request.params;
    const book=books.filter((n)=>n.id===bookId)[0];

    if(book !== undefined){
        const response=h.response({
            status: 'success',
            data:{
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response=h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler=(request,h)=>{
    const {bookId}=request.params;
    const {name,year,author,summary,publisher,pageCount,readPage,reading}=request.payload;
    //const {name,year,author,summary,publisher,pageCount,readPage,reading}=JSON.parse(request.payload);
    const updatedAt = new Date().toISOString();
    const index =books.findIndex((book)=>book.id===bookId);

    const finished = pageCount===readPage;
    if(pageCount<readPage){
        const response=h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if(name===undefined){
        const response=h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(index !== -1){
        books[index]={
            ...books[index],
            name,year,author,summary,publisher,pageCount,readPage,reading,finished,updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response=h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler=(request,h)=>{
    const {bookId}= request.params;
    const index =books.findIndex((book)=>book.id===bookId);

    if (index!==-1){
        books.splice(index,1);
        const response=h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response=h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports ={addBookHandler,getAllBooksHandler,getBookByIdHandler,editBookByIdHandler, deleteBookByIdHandler};