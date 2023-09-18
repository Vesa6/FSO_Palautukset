describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Login Enjoyer',
      username: 'loginEnjoyer',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const user2 = {
      name: 'Test Enjoyer',
      username: 'testEnjoyer',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {

    it('succeeds with correct credentials', function() {
      cy.get('.usernameField').type('loginEnjoyer')
      cy.get('.passwordField').type('test')
      cy.contains('login').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('.usernameField').type('loginEnjoyer')
      cy.get('.passwordField').type('meatballs')
      cy.contains('login').click()
      cy.contains('Wrong username or pass')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('.usernameField').type('loginEnjoyer')
      cy.get('.passwordField').type('test')
      cy.contains('login').click()
    })

    const createNewBlog = (title, author, url) => {
      cy.contains('New blog').click()
      cy.get('.title').type(title)
      cy.get('.author').type(author)
      cy.get('.url').type(url)
      cy.contains('save').click()
      cy.contains('Cancel').click()
    }

    it('Can create blog', function() {
      createNewBlog('Test Blog', 'Test Author', 'Test Url')
      cy.contains('Test Blog')
    })

    it('Can like blog', function() {

      createNewBlog('Test Blog', 'Test Author', 'Test Url')
      cy.contains('view').click()
      cy.get('.likeButton').click()
      cy.contains('1')
    })

    it('Can delete blog', function() {

      createNewBlog('Test Blog', 'Test Author', 'Test Url')
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Test Blog').should('not.exist')
    })

    it('Can not see delete button for others', function() {
      createNewBlog('Test Blog', 'Test Author', 'Test Url')
      // Check that button exists for the correct user
      cy.contains('view').click()
      cy.contains('delete').should('exist')
      // Log in second user
      cy.contains('logout').click()
      cy.get('.usernameField').type('testEnjoyer')
      cy.get('.passwordField').type('test')
      cy.contains('login').click()

      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })

    it('Blogs are sorted correctly by likes', function() {

      // Creates a blog with one like
      createNewBlog('Less Liked Blog', 'Less Liked Author', 'Less Liked Url')

      cy.contains('Less Liked Blog').find('button').contains('view').click()
      cy.contains('Less Liked Blog').find('.likeButton').click()
      cy.contains('Less Liked Blog').should('contain', 'likes 1')
      cy.contains('Less Liked Blog').find('button').contains('hide').click()

      // Creates a blog with two likes
      createNewBlog('More liked blog', 'More liked author', 'More liked url')

      cy.contains('More liked blog').find('button').contains('view').click()
      cy.contains('More liked blog').find('.likeButton').click()
      cy.contains('More liked blog').should('contain', 'likes 1')
      cy.contains('More liked blog').find('.likeButton').click()
      cy.contains('More liked blog').should('contain', 'likes 2')

      // Check the ordering
      cy.get('.blog').eq(0).should('contain', 'More liked blog')
      cy.get('.blog').eq(1).should('contain', 'Less Liked Blog')
    })
  })
})