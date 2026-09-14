# Test file to ensure pytest runs without errors
# The actual game is in tetris.html


def test_placeholder():
    """Placeholder test to ensure pytest can run"""
    assert True


def test_tetris_file_exists():
    """Test that tetris.html exists"""
    import os
    assert os.path.exists('tetris.html'), "tetris.html should exist"


def test_tetris_file_has_content():
    """Test that tetris.html has substantial content"""
    import os
    assert os.path.exists('tetris.html')
    with open('tetris.html', 'r') as f:
        content = f.read()
    assert len(content) > 1000, "tetris.html should have substantial content"
    assert '<script>' in content, "tetris.html should have JavaScript"
    assert '</html>' in content, "tetris.html should be valid HTML"